
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { userProfileData } from '@/lib/data';

const SupportTicketSchema = z.object({
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters long.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }),
});

export type SupportState = {
    message?: string | null;
    errors?: {
        subject?: string[];
        message?: string[];
    } | null;
}

export async function submitSupportTicket(prevState: SupportState, formData: FormData): Promise<SupportState> {
  const validatedFields = SupportTicketSchema.safeParse({
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }

  const { subject, message } = validatedFields.data;
  const db = getFirestore(app);

  try {
    await addDoc(collection(db, 'support-tickets'), {
      subject,
      message,
      userEmail: userProfileData.email,
      userName: userProfileData.name,
      studentId: userProfileData.studentId,
      createdAt: serverTimestamp(),
      status: 'open',
    });

    return {
      message: 'Your support ticket has been submitted! We will get back to you shortly.',
    };
  } catch (error) {
    console.error('Error submitting support ticket to Firestore:', error);
    return {
      message: 'Failed to submit your ticket. Please try again.',
    };
  }
}
