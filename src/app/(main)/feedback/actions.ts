
'use server';

import { z } from 'zod';

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

  try {
    // For now, we'll just log the feedback to the server console.
    // Later, we can replace this with code to save to Firestore.
    console.log('Feedback received:', feedback);

    return {
      message: 'Thank you for your feedback!',
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      message: 'Failed to submit feedback. Please try again.',
    };
  }
}
