// src/services/payments/PaymentService.js
import { collection, query, orderBy, onSnapshot, getDocs, where, serverTimestamp, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

/**
 * Subscribes to Firestore 'payments' collection updates.
 * @param {(payments:Array) => void} onSuccess called with payments array
 * @param {(error:Error) => void} [onError] optional error callback
 * @returns {function} unsubscribe function to stop listening
 */
export function subscribePayments(onSuccess, onError) {
  // Optional: order by payment date if you have one
  const paymentsRef = collection(db, "payments");
  const q = query(paymentsRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const payments = [];
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      onSuccess(payments);
    },
    (error) => {
      if (onError) onError(error);
      else console.error("Error fetching payments:", error);
    }
  );

  return unsubscribe;
}


/**
 * Fetch payment docs for a given orderId from firestore
 * @param {string} orderId
 * @returns {Promise<Array>} payments array
 */
export async function fetchPaymentsByOrderId(orderId) {
  if (!orderId) return [];
  const paymentsRef = collection(db, "payments");
  const q = query(paymentsRef, where("orderId", "==", orderId));
  const querySnapshot = await getDocs(q);
  const payments = [];
  querySnapshot.forEach((doc) => {
    payments.push({ id: doc.id, ...doc.data() });
  });
  return payments;
}


/**
 * Subscribe to realtime payments for a specific orderId
 * @param {string} orderId
 * @param {(payments: Array) => void} onSuccess
 * @param {(error: Error) => void} [onError]
 * @returns {() => void} unsubscribe function
 */
export function subscribePaymentsByOrderId(orderId, onSuccess, onError) {
  if (!orderId) {
    onSuccess([]);
    return () => {};
  }

  const paymentsRef = collection(db, "payments");
  const q = query(paymentsRef, where("orderId", "==", orderId));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const payments = [];
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      onSuccess(payments);
    },
    (err) => {
      if (onError) onError(err);
      else console.error(err);
    }
  );

  return unsubscribe;
}



/**
 * Add a new payment record and update the order's paymentIds array
 * @param {{orderId: string, buyerId:string, sellerId:string, finalPrice:number, paidAmount:number, dueAmount:number, method:string, paymentStatus:string}} paymentData
 * @param {string} orderDocId - the Firestore document ID of the order to update
 * @returns {Promise<string>} payment document ID added
 */
export async function addPayment(paymentData, orderDocId) {
  if (!orderDocId) throw new Error("Order document ID is required");

  // Add createdAt timestamp
  const paymentPayload = {
    ...paymentData,
    createdAt: serverTimestamp(),
  };

  // Add payment doc
  const paymentsRef = collection(db, "payments");
  const paymentDocRef = await addDoc(paymentsRef, paymentPayload);

  // Update order document with new payment ID
  const orderDocRef = doc(db, "orders", orderDocId);

  const orderSnap = await getDoc(orderDocRef);
  if (!orderSnap.exists()) {
    throw new Error("Order not found");
  }
  const orderData = orderSnap.data();
  const existingPaymentIds = orderData.paymentIds || [];

  await updateDoc(orderDocRef, {
    paymentIds: [...existingPaymentIds, paymentDocRef.id],
  });

  // Return payment document ID
  return paymentDocRef.id;
}