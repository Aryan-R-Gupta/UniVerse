
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp, runTransaction, doc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { userProfileData } from '@/lib/data';

const CartItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});

const PlaceOrderSchema = z.object({
  cart: z.array(CartItemSchema),
  totalPrice: z.number(),
});

export type OrderState = {
    message: string;
    success: boolean;
}

export async function placeOrder(prevState: OrderState, formData: FormData): Promise<OrderState> {
  const cartString = formData.get('cart') as string;
  const totalPriceString = formData.get('totalPrice') as string;
  
  if (!cartString || !totalPriceString) {
    return { message: 'Cart data is missing.', success: false };
  }

  try {
    const cart = JSON.parse(cartString);
    const totalPrice = JSON.parse(totalPriceString);

    const validatedFields = PlaceOrderSchema.safeParse({ cart, totalPrice });

    if (!validatedFields.success) {
      return {
        message: 'Validation failed. Please check your cart.',
        success: false,
      };
    }

    const { cart: orderItems, totalPrice: finalPrice } = validatedFields.data;
    const db = getFirestore(app);

    await runTransaction(db, async (transaction) => {
        // 1. Add the order to the 'canteen-orders' collection
        const ordersCol = collection(db, 'canteen-orders');
        addDoc(ordersCol, {
            userEmail: userProfileData.email,
            items: orderItems,
            totalPrice: finalPrice,
            createdAt: serverTimestamp(),
        });
    
        // 2. Add the total sale to the 'canteen-sales' collection for analytics
        const salesCol = collection(db, 'canteen-sales');
        addDoc(salesCol, {
            sales: finalPrice,
            date: serverTimestamp(),
            itemCount: orderItems.reduce((acc, item) => acc + item.quantity, 0)
        });

        // 3. Update the total revenue and items sold for each item in 'canteen-items'
        for (const item of orderItems) {
            const itemRef = doc(db, 'canteen-items', `item-${item.id}`);
            const itemDoc = await transaction.get(itemRef);

            if (itemDoc.exists()) {
                const currentRevenue = itemDoc.data().totalRevenue || 0;
                const currentItemsSold = itemDoc.data().itemsSold || 0;

                transaction.update(itemRef, {
                    totalRevenue: currentRevenue + (item.price * item.quantity),
                    itemsSold: currentItemsSold + item.quantity
                });
            } else {
                console.warn(`Canteen item with ID item-${item.id} not found.`);
            }
        }
    });

    return {
      message: 'Order placed successfully! Your food is being prepared.',
      success: true,
    };

  } catch (error) {
    console.error('Error placing order:', error);
    return {
      message: 'Failed to place your order. Please try again.',
      success: false,
    };
  }
}
