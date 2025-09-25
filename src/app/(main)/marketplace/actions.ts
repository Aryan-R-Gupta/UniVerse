
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { userProfileData } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const ListItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  contact: z.string().min(5, 'Please provide valid contact information.'),
});

export type ListItemState = {
    message?: string | null;
    errors?: {
        title?: string[];
        description?: string[];
        price?: string[];
        category?: string[];
        contact?: string[];
    } | null;
}

export async function listItem(prevState: ListItemState, formData: FormData): Promise<ListItemState> {
    const validatedFields = ListItemSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        contact: formData.get('contact'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed. Please check your input.',
        };
    }

    const { title, description, price, category, contact } = validatedFields.data;
    const db = getFirestore(app);

    try {
        await addDoc(collection(db, 'marketplace-items'), {
            title,
            description,
            price,
            category,
            contact,
            sellerName: userProfileData.name,
            sellerEmail: userProfileData.email,
            createdAt: serverTimestamp(),
        });

        revalidatePath('/marketplace');

        return {
            message: 'Your item has been listed successfully!',
        };
    } catch (error) {
        console.error('Error listing item:', error);
        return {
            message: 'Failed to list your item. Please try again.',
        };
    }
}


const UpdateItemSchema = ListItemSchema.extend({
  itemId: z.string().min(1),
});

export async function updateItem(prevState: ListItemState, formData: FormData): Promise<ListItemState> {
    const validatedFields = UpdateItemSchema.safeParse({
        itemId: formData.get('itemId'),
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        contact: formData.get('contact'),
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed. Please check your input.',
        };
    }

    const { itemId, ...itemData } = validatedFields.data;
    const db = getFirestore(app);
    const itemRef = doc(db, 'marketplace-items', itemId);

    try {
        const itemDoc = await getDoc(itemRef);
        if (!itemDoc.exists() || itemDoc.data().sellerEmail !== userProfileData.email) {
             return { message: 'Unauthorized or item not found.', errors: {} };
        }

        await updateDoc(itemRef, itemData);
        revalidatePath('/marketplace');
        return { message: 'Item updated successfully!' };
    } catch (error) {
         console.error('Error updating item:', error);
        return { message: 'Failed to update item.' };
    }
}


export async function deleteItem(formData: FormData): Promise<{ message: string }> {
    const itemId = formData.get('itemId') as string;
    const db = getFirestore(app);
    const itemRef = doc(db, 'marketplace-items', itemId);

    try {
        const itemDoc = await getDoc(itemRef);
        if (!itemDoc.exists() || itemDoc.data().sellerEmail !== userProfileData.email) {
             return { message: 'Unauthorized or item not found.' };
        }

        await deleteDoc(itemRef);
        revalidatePath('/marketplace');
        return { message: 'Item deleted successfully.' };
    } catch (error) {
        console.error('Error deleting item:', error);
        return { message: 'Failed to delete item.' };
    }
}
