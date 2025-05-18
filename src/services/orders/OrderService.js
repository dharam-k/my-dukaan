import { collection, addDoc,onSnapshot, serverTimestamp, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // adjust path as needed

const ORDERS_COLLECTION = "orders";

/**
 * Save a new order to Firestore
 * @param {object} order - order data to save
 * @returns {string} document id of created order
 */
export async function addOrder(order) {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...order,
      created_at: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.error("Error adding order:", err);
    throw err;
  }
}

/**
 * Fetch all orders for a buyer, optionally ordered by created_at desc
 * @param {string} buyerId 
 * @returns array of order objects
 */
export async function fetchOrdersByBuyer(buyerId) {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("buyerId", "==", buyerId),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err;
  }
}


/**
 * Subscribe to orders collection with real-time updates
 * sorted by created_at descending.
 * @param {(orders: array) => void} callback function to receive orders
 * @returns unsubscribe function to stop listening
 */
export function subscribeOrders(callback, errorCallback) {
  const ordersQuery = query(collection(db, "orders"), orderBy("created_at", "desc"));

  const unsubscribe = onSnapshot(
    ordersQuery,
    (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    },
    (error) => {
      if (typeof errorCallback === "function") errorCallback(error);
    }
  );

  return unsubscribe;
}


/**
 * Fetch order by orderId (field) using query
 * @param {string} orderId - orderId value (not doc id)
 * @returns {Promise<Object|null>} order data or null if not found
 */
export async function getOrderById(orderId) {
  if (!orderId) return null;

  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, where("orderId", "==", orderId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    // Usually orderId should be unique, take first doc
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (err) {
    console.error("Error fetching order by orderId:", err);
    throw err;
  }
}