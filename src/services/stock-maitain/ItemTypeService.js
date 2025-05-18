// src/services/ItemTypeService.js
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

const ITEM_TYPE_COLLECTION = "itemTypes";

/**
 * Fetch all item types ordered by name.
 * Each item type assumed to have { id, name }.
 */
export async function fetchItemTypes() {
  const q = query(collection(db, ITEM_TYPE_COLLECTION), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Add a new item type.
 * @param {Object} itemType - e.g., { name: "Type A" }
 */
export async function addItemType(itemType) {
  const docRef = await addDoc(collection(db, ITEM_TYPE_COLLECTION), itemType);
  return { id: docRef.id, ...itemType };
}

/**
 * Update an item type by id.
 * @param {string} id
 * @param {Object} itemType - new data
 */
export async function updateItemType(id, itemType) {
  const docRef = doc(db, ITEM_TYPE_COLLECTION, id);
  await updateDoc(docRef, itemType);
}

/**
 * Delete an item type by id.
 * @param {string} id
 */
export async function deleteItemType(id) {
  const docRef = doc(db, ITEM_TYPE_COLLECTION, id);
  await deleteDoc(docRef);
}