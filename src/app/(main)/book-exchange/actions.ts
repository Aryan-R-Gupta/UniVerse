
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { userProfileData } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const ListBookSchema = z.object({
  title: z.string().min(3, { message: 'Book title must be at least 3 characters.' }),
  author: z.string().min(3, { message: 'Author name must be at least 3 characters.' }),
  condition: z.string().min(3, { message: 'Condition must be at least 3 characters.' }),
});

export type BookListState = {
    message?: string | null;
    errors?: {
        title?: string[];
        author?: string[];
        condition?: string[];
    } | null;
}

export async function listBook(prevState: BookListState, formData: FormData): Promise<BookListState> {
  const validatedFields = ListBookSchema.safeParse({
    title: formData.get('title'),
    author: formData.get('author'),
    condition: formData.get('condition'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }

  const { title, author, condition } = validatedFields.data;
  const db = getFirestore(app);

  try {
    await addDoc(collection(db, 'book-exchange'), {
      title,
      author,
      condition,
      listedByName: userProfileData.name,
      listedByEmail: userProfileData.email,
      status: 'Available',
      createdAt: serverTimestamp(),
    });

    revalidatePath('/book-exchange');

    return {
      message: 'Your book has been listed successfully!',
    };
  } catch (error) {
    console.error('Error listing book:', error);
    return {
      message: 'Failed to list your book. Please try again.',
    };
  }
}

    