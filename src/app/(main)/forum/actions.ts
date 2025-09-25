
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp, doc, runTransaction } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { userProfileData } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { forumChannels } from './data';

const CreatePostSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters.' }),
  channel: z.string().refine(value => forumChannels.some(c => c.id === value), { message: 'Invalid channel selected.' }),
});

export type CreatePostState = {
    message?: string | null;
    errors?: {
        title?: string[];
        content?: string[];
        channel?: string[];
    } | null;
}

export async function createPost(prevState: CreatePostState, formData: FormData): Promise<CreatePostState> {
  const validatedFields = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    channel: formData.get('channel'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }

  const { title, content, channel } = validatedFields.data;
  const db = getFirestore(app);

  try {
    await addDoc(collection(db, 'forum-posts'), {
      title,
      content,
      channel,
      authorName: userProfileData.name,
      authorEmail: userProfileData.email,
      createdAt: serverTimestamp(),
      upvotes: 0,
      commentCount: 0,
    });

    revalidatePath('/forum');

    return {
      message: 'Your post has been created successfully!',
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      message: 'Failed to create your post. Please try again.',
    };
  }
}

const AddCommentSchema = z.object({
    comment: z.string().min(1, { message: 'Comment cannot be empty.' }),
});

export type AddCommentState = {
    message?: string | null;
    errors?: {
        comment?: string[];
    } | null;
}

export async function addComment(postId: string, prevState: AddCommentState, formData: FormData): Promise<AddCommentState> {
    const validatedFields = AddCommentSchema.safeParse({
        comment: formData.get('comment'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed.',
        };
    }

    const { comment } = validatedFields.data;
    const db = getFirestore(app);
    const postRef = doc(db, 'forum-posts', postId);
    const commentsCol = collection(db, 'forum-comments');

    try {
        await runTransaction(db, async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists()) {
                throw new Error("Post does not exist!");
            }

            // 1. Add the new comment
            transaction.set(doc(commentsCol), {
                postId,
                content: comment,
                authorName: userProfileData.name,
                authorEmail: userProfileData.email,
                createdAt: serverTimestamp(),
            });

            // 2. Update the comment count on the post
            const newCommentCount = (postDoc.data().commentCount || 0) + 1;
            transaction.update(postRef, { commentCount: newCommentCount });
        });
        
        revalidatePath(`/forum/post/${postId}`);

        return { message: 'Comment added successfully.' };

    } catch (e) {
        console.error('Error adding comment:', e);
        return { message: 'Failed to add comment. Please try again.' };
    }
}
