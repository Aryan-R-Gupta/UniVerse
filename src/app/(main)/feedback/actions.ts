
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const FeedbackSchema = z.object({
  feedback: z.string().min(10, { message: 'Feedback must be at least 10 characters long.' }),
});

export type FeedbackState = {
    message?: string | null;
    errors?: {
        feedback?: string[];
    } | null;
}

export async function submitFeedback(prevState: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const validatedFields = FeedbackSchema.safeParse({
    feedback: formData.get('feedback'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }

  const { feedback } = validatedFields.data;
  const db = getFirestore(app);

  try {
    await addDoc(collection(db, 'feedback'), {
      text: feedback,
      createdAt: serverTimestamp(),
    });

    return {
      message: 'Thank you for your feedback!',
    };
  } catch (error) {
    console.error('Error submitting feedback to Firestore:', error);
    return {
      message: 'Failed to submit feedback. Please try again.',
    };
  }
}
