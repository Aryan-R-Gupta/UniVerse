
'use server';

import { z } from 'zod';
import {
  getFirestore,
  collection,
  serverTimestamp,
  runTransaction,
  doc,
} from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { userProfileData } from '@/lib/data';

// Coerce numeric fields because client often sends strings
const CartItemSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
});

const PlaceOrderSchema = z.object({
  cart: z.array(CartItemSchema),
  totalPrice: z.coerce.number(),
});

export type OrderState = {
  message: string;
  success: boolean;
};

export async function placeOrder(prevState: OrderState, formData: FormData): Promise<OrderState> {
  const cartString = formData.get('cart') as string | null;
  const totalPriceString = formData.get('totalPrice') as string | null;

  if (!cartString || !totalPriceString) {
    return { message: 'Cart data is missing.', success: false };
  }

  let validatedFields;
  try {
    const cart = JSON.parse(cartString);
    const totalPrice = JSON.parse(totalPriceString);
    validatedFields = PlaceOrderSchema.safeParse({ cart, totalPrice });

    if (!validatedFields.success) {
      console.error('Zod validation failed:', validatedFields.error.format ? validatedFields.error.format() : validatedFields.error);
      return {
        message: 'Validation failed. Please check your cart.',
        success: false,
      };
    }
  } catch (e) {
    console.error('Failed to parse cart data', e);
    return { message: 'Invalid cart format.', success: false };
  }

  const { cart: orderItems, totalPrice: finalPrice } = validatedFields.data;
  const db = getFirestore(app);

  const userEmail = userProfileData?.email ?? null;
  if (!userEmail) {
    console.warn('No user email available in server context.');
    return { message: 'User not authenticated.', success: false };
  }

  try {
    await runTransaction(db, async (transaction) => {
      const ordersColRef = collection(db, 'canteen-orders');
      const salesColRef = collection(db, 'canteen-sales');

      // 1. Create a new order document
      const newOrderRef = doc(ordersColRef);
      transaction.set(newOrderRef, {
        userEmail,
        items: orderItems,
        totalPrice: finalPrice,
        createdAt: serverTimestamp(),
      });

      // 2. Create a new sales analytics document
      const newSaleRef = doc(salesColRef);
      transaction.set(newSaleRef, {
        orderId: newOrderRef.id,
        sales: finalPrice,
        date: serverTimestamp(),
        itemCount: orderItems.reduce((acc, item) => acc + item.quantity, 0),
      });

      // 3. Update total sales for each item
      for (const item of orderItems) {
        const itemRef = doc(db, 'canteen-items', `item-${item.id}`);
        const itemDoc = await transaction.get(itemRef);

        if (!itemDoc.exists()) {
          // If the item doesn't exist in our analytics collection, create it.
          // This case should ideally be handled by a seeding script, but we add it for robustness.
          transaction.set(itemRef, {
            name: item.name,
            price: item.price,
            itemsSold: item.quantity,
            totalRevenue: item.price * item.quantity,
          });
        } else {
          // If the item exists, update its sales figures
          const currentRevenue = itemDoc.data().totalRevenue || 0;
          const currentItemsSold = itemDoc.data().itemsSold || 0;
          
          transaction.update(itemRef, {
            totalRevenue: currentRevenue + (item.price * item.quantity),
            itemsSold: currentItemsSold + item.quantity,
          });
        }
      }
    });

    return {
      message: 'Order placed successfully! Your food is being prepared.',
      success: true,
    };
  } catch (error: any) {
    console.error('Error placing order in transaction:', error);
    return {
      message: 'Failed to place your order. Please try again.',
      success: false,
    };
  }
}
