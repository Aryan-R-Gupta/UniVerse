
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { userProfileData } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const UploadNoteSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  course: z.string().min(3, { message: 'Course name must be at least 3 characters.' }),
});

export type UploadNoteState = {
    message?: string | null;
    errors?: {
        title?: string[];
        course?: string[];
        file?: string[];
    } | null;
}

export async function uploadNote(prevState: UploadNoteState, formData: FormData): Promise<UploadNoteState> {
  const validatedFields = UploadNoteSchema.safeParse({
    title: formData.get('title'),
    course: formData.get('course'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }
  
  const file = formData.get('file') as File | null;
  // When a File object is passed via server action, it becomes a plain object.
  // We need to check its properties carefully.
  if (!file || typeof file !== 'object' || !('size' in file) || file.size === 0) {
    return {
        errors: { file: ['Please select a file to upload.'] },
        message: 'File is required.'
    }
  }

  const { title, course } = validatedFields.data;
  const db = getFirestore(app);

  try {
    await addDoc(collection(db, 'notes'), {
      title,
      course,
      fileName: file.name || 'Untitled',
      fileType: file.type || 'application/octet-stream',
      authorName: userProfileData.name,
      authorEmail: userProfileData.email,
      createdAt: serverTimestamp(),
    });

    revalidatePath('/notes');

    return {
      message: 'Your note has been uploaded successfully!',
    };
  } catch (error) {
    console.error('Error uploading note:', error);
    return {
      message: 'Failed to upload your note. Please try again.',
    };
  }
}
