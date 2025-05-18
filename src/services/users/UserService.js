// src/services/UserService.js
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

export function subscribeCurrentUser(callback) {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // include user id with data
          callback({ id: userDocSnap.id, ...userDocSnap.data() });
        } else {
          callback(null);
        }
      } catch (error) {
        console.error("UserService: Failed to fetch user details", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });

  return unsubscribe;
}

export async function logout() {
  await auth.signOut();
}

/**
 * Subscribes to real-time updates from the 'users' collection.
 * @param {(users: Array) => void} onSuccess Callback with array of user objects
 * @param {(error: Error) => void} [onError] Optional error callback
 * @returns {function} Unsubscribe function
 */
export function subscribeUsers(onSuccess, onError) {
  const usersRef = collection(db, "users");

  const unsubscribe = onSnapshot(
    usersRef,
    (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      onSuccess(users);
    },
    (error) => {
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

export async function getUserById(userId) {
  if (!userId) return null;

  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return { id: userDocSnap.id, ...userDocSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user by ID:", error);
    return null;
  }
}


export async function updateUser(userId, userData) {
  if (!userId) throw new Error("User ID is required");
  const userDocRef = doc(db, "users", userId);
  await setDoc(userDocRef, userData, { merge: true }); // merge true to update only passed fields
}

