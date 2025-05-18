// src/services/MillService.js
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

const MILLS_COLLECTION = "mills";

/**
 * Fetch all mills ordered by millName.
 */
export async function fetchMills() {
  const q = query(collection(db, MILLS_COLLECTION), orderBy("millName", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Add new mill.
 * @param {Object} mill - e.g. { millName, address, mobile, gstn }
 * @returns {Object} newly added mill with id
 */
export async function addMill(mill) {
  const docRef = await addDoc(collection(db, MILLS_COLLECTION), mill);
  return { id: docRef.id, ...mill };
}

/**
 * Update mill by id.
 * @param {string} id
 * @param {Object} mill
 */
export async function updateMill(id, mill) {
  const docRef = doc(db, MILLS_COLLECTION, id);
  await updateDoc(docRef, mill);
}

/**
 * Delete mill by id.
 * @param {string} id
 */
export async function deleteMill(id) {
  const docRef = doc(db, MILLS_COLLECTION, id);
  await deleteDoc(docRef);
}