// src/services/DharmakataService.js
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

const DHARMAKATA_COLLECTION = "dharmakatas";

/**
 * Fetch all dharmakatas ordered by name.
 * Assumes each item has { id, name }.
 */
export async function fetchDharmakatas() {
  const q = query(collection(db, DHARMAKATA_COLLECTION), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Add a new dharmakata.
 * @param {Object} dharmakata - e.g., { name: "Dharmakata A" }
 */
export async function addDharmakata(dharmakata) {
  const docRef = await addDoc(collection(db, DHARMAKATA_COLLECTION), dharmakata);
  return { id: docRef.id, ...dharmakata };
}

/**
 * Update a dharmakata by id.
 * @param {string} id
 * @param {Object} dharmakata - new data
 */
export async function updateDharmakata(id, dharmakata) {
  const docRef = doc(db, DHARMAKATA_COLLECTION, id);
  await updateDoc(docRef, dharmakata);
}

/**
 * Delete dharmakata by id.
 * @param {string} id
 */
export async function deleteDharmakata(id) {
  const docRef = doc(db, DHARMAKATA_COLLECTION, id);
  await deleteDoc(docRef);
}