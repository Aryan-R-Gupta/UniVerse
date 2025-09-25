
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

const PublishAlertSchema = z.object({
  alertMessage: z.string().min(10, { message: 'Alert message must be at least 10 characters.' }),
});

export type PublishAlertState = {
    message?: string | null;
    errors?: {
        alertMessage?: string[];
    } | null;
}

export async function publishAlert(prevState: PublishAlertState, formData: FormData): Promise<PublishAlertState> {
  const validatedFields = PublishAlertSchema.safeParse({
    alertMessage: formData.get('alertMessage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }

  const { alertMessage } = validatedFields.data;
  const db = getFirestore(app);

  try {
    await addDoc(collection(db, 'campus-alerts'), {
      message: alertMessage,
      createdAt: serverTimestamp(),
    });

    revalidatePath('/dashboard'); 

    return {
      message: 'The campus alert has been published successfully!',
    };
  } catch (error) {
    console.error('Error publishing alert:', error);
    return {
      message: 'Failed to publish the alert. Please try again.',
    };
  }
}
