// src/services/payments/counter.js
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const paymentCounterDocRef = doc(db, "counters", "payments");

export async function getNextPaymentId() {
  try {
    return await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(paymentCounterDocRef);

      let lastNumber = 0;
      if (!counterDoc.exists()) {
        transaction.set(paymentCounterDocRef, { lastIssuedPaymentNumber: 0 });
      } else {
        lastNumber = counterDoc.data().lastIssuedPaymentNumber || 0;
      }

      const nextNumber = lastNumber + 1;
      transaction.update(paymentCounterDocRef, { lastIssuedPaymentNumber: nextNumber });

      const padded = String(nextNumber).padStart(5, "0");
      return `PAY-${padded}`;
    });
  } catch (error) {
    console.error("Failed to get next payment ID:", error);
    throw error;
  }
}