
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { userProfileData } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const UploadNoteSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  course: z.string().min(3, { message: 'Course name must be at least 3 characters.' }),
  // Content validation is removed as we are now handling a file
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
  if (!file || file.size === 0) {
    return {
        errors: { file: ['Please select a file to upload.'] },
        message: 'File is required.'
    }
  }

  // Basic check for PDF files, can be expanded
  if (file.type !== 'application/pdf') {
     return {
        errors: { file: ['Only PDF files are currently supported.'] },
        message: 'Invalid file type.'
    }
  }

  const { title, course } = validatedFields.data;
  const db = getFirestore(app);

  try {
    await addDoc(collection(db, 'notes'), {
      title,
      course,
      fileName: file.name,
      fileType: file.type,
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
