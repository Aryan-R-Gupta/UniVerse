
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { userProfileData } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const BookResourceSchema = z.object({
  resourceId: z.string().min(1, { message: 'Resource ID is required.' }),
  resourceName: z.string().min(1, { message: 'Resource name is required.' }),
  timeSlot: z.string().min(1, { message: 'A time slot must be selected.' }),
});

export type BookingState = {
    message?: string | null;
    errors?: {
        resourceId?: string[];
        resourceName?: string[];
        timeSlot?: string[];
        general?: string[];
    } | null;
}

export async function bookResource(prevState: BookingState, formData: FormData): Promise<BookingState> {
  const validatedFields = BookResourceSchema.safeParse({
    resourceId: formData.get('resourceId'),
    resourceName: formData.get('resourceName'),
    timeSlot: formData.get('timeSlot'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }

  const { resourceId, resourceName, timeSlot } = validatedFields.data;
  const db = getFirestore(app);
  const bookingsCol = collection(db, 'resource-bookings');

  try {
    
    const q = query(bookingsCol, where('resourceId', '==', resourceId), where('timeSlot', '==', timeSlot));
    const existingBookings = await getDocs(q);

    if (!existingBookings.empty) {
        return {
            errors: { general: ['This time slot is already booked. Please select another time.'] },
            message: 'Booking failed.',
        }
    }

    await addDoc(bookingsCol, {
      resourceId,
      resourceName,
      timeSlot,
      userEmail: userProfileData.email,
      userName: userProfileData.name,
      status: 'Confirmed', 
      bookedAt: serverTimestamp(),
    });
    
    
    revalidatePath('/resources');

    return {
      message: `Successfully booked ${resourceName} for ${timeSlot}.`,
    };
  } catch (error) {
    console.error('Error booking resource:', error);
    return {
      errors: { general: ['An unexpected error occurred. Please try again.'] },
      message: 'Failed to book resource.',
    };
  }
}
