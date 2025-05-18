// src/services/WarehouseService.js
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const WAREHOUSE_COLLECTION = "warehouses";

/**
 * Fetch all warehouses from Firestore, ordered by name.
 * Each warehouse is assumed to be stored with at least { id, name }.
 */
export async function fetchWarehouses() {
  const q = query(collection(db, WAREHOUSE_COLLECTION), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Add a new warehouse.
 * @param {Object} warehouse - Data, e.g., { name: "Warehouse A" }
 * @returns {Object} newly created warehouse with id
 */
export async function addWarehouse(warehouse) {
  const docRef = await addDoc(collection(db, WAREHOUSE_COLLECTION), warehouse);
  return { id: docRef.id, ...warehouse };
}

/**
 * Update a warehouse by id.
 * @param {string} id
 * @param {Object} warehouse - new data
 */
export async function updateWarehouse(id, warehouse) {
  const docRef = doc(db, WAREHOUSE_COLLECTION, id);
  await updateDoc(docRef, warehouse);
}

/**
 * Delete warehouse by id.
 * @param {string} id
 */
export async function deleteWarehouse(id) {
  const docRef = doc(db, WAREHOUSE_COLLECTION, id);
  await deleteDoc(docRef);
}