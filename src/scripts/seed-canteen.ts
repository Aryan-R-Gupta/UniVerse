
// To run this script, use the following command in your terminal:
// npx tsx src/scripts/seed-canteen.ts

import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { allCanteenItems } from '@/lib/data';

async function seedCanteenItems() {
  const db = getFirestore(app);
  const itemsCol = collection(db, 'canteen-items');
  
  const allItems = [
    ...allCanteenItems.snacks,
    ...allCanteenItems.drinks,
    ...allCanteenItems.meals,
  ];

  console.log('Starting to seed canteen items...');

  for (const item of allItems) {
    // We'll use a consistent ID format like `item-1`, `item-2`, etc.
    const docId = `item-${item.id}`;
    const itemRef = doc(db, itemsCol.path, docId);

    try {
      await setDoc(itemRef, {
        name: item.name,
        price: item.price,
        // Assuming canteen item categories are based on the keys in allCanteenItems
        category: findCategory(item.id),
        itemsSold: 0,
        totalRevenue: 0,
      });
      console.log(`Successfully seeded: ${item.name}`);
    } catch (error) {
      console.error(`Failed to seed ${item.name}:`, error);
    }
  }

  console.log('Seeding complete. Your "canteen-items" collection should now be populated.');
  console.log('You may need to restart the application to see the changes.');
  process.exit(0);
}

function findCategory(itemId: number): string {
    if (allCanteenItems.snacks.some(i => i.id === itemId)) return 'Snacks';
    if (allCanteenItems.drinks.some(i => i.id === itemId)) return 'Drinks';
    if (allCanteenItems.meals.some(i => i.id === itemId)) return 'Meals';
    return 'Uncategorized';
}


seedCanteenItems();
