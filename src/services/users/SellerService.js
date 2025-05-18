// src/services/SellerService.js
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp, 
  getDoc
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();

const USERS_COLLECTION = "users";

/**
 * Fetch all sellers (userType === 'seller') ordered by name.
 */
export async function fetchSellers() {
  const q = query(
    collection(db, USERS_COLLECTION),
    where("userType", "==", "seller"),
    orderBy("name", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Create new seller Firebase Auth user AND store profile in Firestore users collection.
 *
 * @param {Object} seller - e.g. { name, phone, address, email, password, gstn, isActive, loginActive }
 * @returns {Object} created user data with uid
 */
export async function addSeller(seller) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be signed in to add a seller.");
  }
  try {
    const createSeller = httpsCallable(functions, "createSeller");
    const result = await createSeller(seller);
    return result.data;
  } catch (error) {
    // Handle specific error codes with friendly messages
    if (error.code === "auth/email-already-in-use") {
      throw new Error("The email address is already registered. Please use a different email.");
    }

    // other example error handling
    if (error.code === "unauthenticated") {
      throw new Error("You must be signed in to add a seller.");
    } 

    if (error.code === "invalid-argument") {
      throw new Error("Please provide all required seller information.");
    }

    // fallback generic error
    console.error("addSeller error:", error);
    throw new Error("Sorry, something went wrong while adding the seller.");
  }
}
/**
 * Update seller profile by id in Firestore.
 *
 * NOTE: Email & password updates must be handled via Firebase Auth separately.
 * This function does NOT update email or password in Firebase Auth.
 *
 * @param {string} id - user UID
 * @param {Object} seller - partial user fields to update (except email/password)
 */
export async function updateSeller(id, seller) {
  const docRef = doc(db, USERS_COLLECTION, id);

  // Remove email and password from update fields (if present) - handle auth updates separately!
  const { email, password, ...otherFields } = seller;

  // Ensure userType remains "seller"
  await updateDoc(docRef, { ...otherFields, userType: "seller" });
}

/**
 * Delete seller both from Firebase Auth and Firestore.
 *
 * IMPORTANT: Deleting a Firebase Auth user requires authenticated admin privileges.
 * Here we only delete Firestore document. Use Firebase Admin SDK to delete Auth user securely.
 *
 * @param {string} id - user UID
 */
export async function deleteSeller(id) {
  // Delete seller profile in Firestore
  const docRef = doc(db, USERS_COLLECTION, id);
  await deleteDoc(docRef);

  // Deleting Auth user requires admin privileges - handle via backend or Admin SDK separately.
}



/**
 * Fetch a single seller profile by their Firestore document ID.
 * 
 * @param {string} id - The Firestore document ID (seller UID)
 * @returns {Object|null} seller data if found, otherwise null
 */
export async function fetchSellerById(id) {
  if (!id) throw new Error("Seller ID is required");

  const docRef = doc(db, USERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    // Document does not exist
    return null;
  }
}