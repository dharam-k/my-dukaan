// src/services/users/getUser.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";


export default async function getUserById(userId) {
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