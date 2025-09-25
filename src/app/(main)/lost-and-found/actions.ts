'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { userProfileData } from '@/lib/data';

const ItemReportSchema = z.object({
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
});

export type ReportState = {
    message?: string | null;
    errors?: {
        description?: string[];
        location?: string[];
        category?: string[];
    } | null;
    success?: boolean;
}

async function reportItem(status: 'lost' | 'found', prevState: ReportState, formData: FormData): Promise<ReportState> {
  const validatedFields = ItemReportSchema.safeParse({
    description: formData.get('description'),
    location: formData.get('location'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
      success: false,
    };
  }

  const { description, location, category } = validatedFields.data;
  const db = getFirestore(app);

  try {
    await addDoc(collection(db, 'lost-and-found-items'), {
      description,
      location,
      category,
      status,
      reportedByName: userProfileData.name,
      reportedByEmail: userProfileData.email,
      reportedAt: serverTimestamp(),
    });

    // Revalidate the page to show the new item in the feed if it was found
    if (status === 'found') {
        revalidatePath('/lost-and-found');
    }

    return {
      message: `Your ${status} item has been reported successfully.`,
      success: true,
    };
  } catch (error) {
    console.error(`Error reporting ${status} item:`, error);
    return {
      message: 'Failed to submit your report. Please try again.',
      success: false,
    };
  }
}

export const reportLostItem = reportItem.bind(null, 'lost');
export const reportFoundItem = reportItem.bind(null, 'found');