
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

  let validatedFields;
  try {
    const cart = JSON.parse(cartString);
    const totalPrice = JSON.parse(totalPriceString);
    validatedFields = PlaceOrderSchema.safeParse({ cart, totalPrice });

    if (!validatedFields.success) {
      console.error(validatedFields.error);
      return {
        message: 'Validation failed. Please check your cart.',
        success: false,
      };
    }
  } catch (e) {
    console.error("Failed to parse cart data", e);
    return { message: 'Invalid cart format.', success: false };
  }

  const { cart: orderItems, totalPrice: finalPrice } = validatedFields.data;
  const db = getFirestore(app);

  try {
    await runTransaction(db, async (transaction) => {
      const ordersCol = collection(db, 'canteen-orders');
      const salesCol = collection(db, 'canteen-sales');
      
      // 1. Create a new document reference for the order and set it within the transaction
      const newOrderRef = doc(ordersCol);
      transaction.set(newOrderRef, {
        userEmail: userProfileData.email,
        items: orderItems,
        totalPrice: finalPrice,
        createdAt: serverTimestamp(),
      });
  
      // 2. Create a new document reference for the sales record and set it
      const newSaleRef = doc(salesCol);
      transaction.set(newSaleRef, {
        sales: finalPrice,
        date: serverTimestamp(),
        itemCount: orderItems.reduce((acc, item) => acc + item.quantity, 0)
      });

      // 3. Update the total revenue and items sold for each item
      for (const item of orderItems) {
        const itemRef = doc(db, 'canteen-items', `item-${item.id}`);
        
        // You must read the document inside the transaction before you can write to it.
        const itemDoc = await transaction.get(itemRef);

        if (!itemDoc.exists()) {
          // If the item doesn't exist in analytics, create it.
          transaction.set(itemRef, {
            name: item.name,
            price: item.price,
            itemsSold: item.quantity,
            totalRevenue: item.price * item.quantity,
            // Assuming category can be derived or is not strictly needed here for the transaction
          });
        } else {
          // If it exists, update it.
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

  } catch (error) {
    console.error('Error placing order:', error);
    return {
      message: 'Failed to place your order. Please try again.',
      success: false,
    };
  }
}
