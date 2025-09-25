
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
    const newOrderRef = doc(collection(db, 'canteen-orders'));
    const newSaleRef = doc(collection(db, 'canteen-sales'));
    const itemRefs = orderItems.map(item => doc(db, 'canteen-items', `item-${item.id}`));

    await runTransaction(db, async (transaction) => {
      const itemDocs = await Promise.all(itemRefs.map(ref => transaction.get(ref)));

      
      for (let i = 0; i < orderItems.length; i++) {
        const itemDoc = itemDocs[i];
        const orderItem = orderItems[i];
        if (!itemDoc.exists()) {
          throw new Error(`Item "${orderItem.name}" does not exist in inventory.`);
        }
        const currentStock = itemDoc.data().stockLevel || 0;
        if (currentStock < orderItem.quantity) {
          throw new Error(`Not enough stock for ${orderItem.name}. Only ${currentStock} left.`);
        }
      }

      
      transaction.set(newOrderRef, {
        userEmail,
        items: orderItems,
        totalPrice: finalPrice,
        createdAt: serverTimestamp(),
      });

      transaction.set(newSaleRef, {
        orderId: newOrderRef.id,
        sales: finalPrice,
        date: serverTimestamp(),
        itemCount: orderItems.reduce((acc, item) => acc + item.quantity, 0),
      });

      orderItems.forEach((item, index) => {
        const itemDoc = itemDocs[index];
        const itemRef = itemRefs[index];
        
        const currentData = itemDoc.data();
        const currentRevenue = currentData.totalRevenue || 0;
        const currentItemsSold = currentData.itemsSold || 0;
        const currentStock = currentData.stockLevel || 0;
        
        transaction.update(itemRef, {
          totalRevenue: currentRevenue + (item.price * item.quantity),
          itemsSold: currentItemsSold + item.quantity,
          stockLevel: currentStock - item.quantity, 
        });
      });
    });

    return {
      message: 'Order placed successfully! Your food is being prepared.',
      success: true,
    };
  } catch (error: any) {
    console.error('Error placing order in transaction:', error);
    return {
      message: error.message || 'Failed to place your order. Please try again.',
      success: false,
    };
  }
}
