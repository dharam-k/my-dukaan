// src/services/orders/counter.js
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../../firebase/firebase";


const counterDocRef = doc(db, "counters", "orders");

export async function getNextOrderId() {
  try {
    const newOrderId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);
      
      let lastNumber = 0;
      if (!counterDoc.exists()) {
        // If counter doc doesn't exist, create it with 0
        transaction.set(counterDocRef, { lastIssuedOrderNumber: 0 });
      } else {
        lastNumber = counterDoc.data().lastIssuedOrderNumber || 0;
      }

      const nextNumber = lastNumber + 1;

      // Update counter document with next number
      transaction.update(counterDocRef, { lastIssuedOrderNumber: nextNumber });

      // Return formatted ID string
      const padded = String(nextNumber).padStart(4, "0");
      return `OD-${padded}`;
    });

    return newOrderId;
  } catch (error) {
    console.error("Failed to generate next order ID:", error);
    throw error;
  }
}