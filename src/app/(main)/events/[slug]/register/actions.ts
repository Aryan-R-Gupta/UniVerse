
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { events } from '@/lib/data';

const RegistrationSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters long.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  studentId: z.string().min(4, { message: 'Student ID must be at least 4 characters long.' }),
});

export type RegistrationState = {
    message?: string | null;
    errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        studentId?: string[];
    } | null;
    registrationId?: string | null;
}

export async function registerForEvent(eventSlug: string, prevState: RegistrationState, formData: FormData): Promise<RegistrationState> {
  const validatedFields = RegistrationSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    studentId: formData.get('studentId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }
  
  const event = events.find(e => e.slug === eventSlug);
  if (!event) {
    return {
        message: 'The event you are trying to register for does not exist.',
        errors: {}
    }
  }

  const { firstName, lastName, email, studentId } = validatedFields.data;
  const db = getFirestore(app);

  try {
    const eventData = events.find(e => e.slug === eventSlug);

    const docRef = await addDoc(collection(db, 'event-registrations'), {
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: eventData?.category, // For analytics
      eventSlug: event.slug,
      firstName,
      lastName,
      email,
      studentId,
      registeredAt: serverTimestamp(),
    });

    return {
      message: `You have successfully registered for ${event.title}!`,
      registrationId: docRef.id,
    };
  } catch (error) {
    console.error('Error submitting registration to Firestore:', error);
    return {
      message: 'Failed to complete registration. Please try again.',
    };
  }
}
