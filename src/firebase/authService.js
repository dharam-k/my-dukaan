// authService.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Log in user with email & password
export async function loginUser(email, password) {
  try {
    // 1. Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. Fetch user data from Firestore
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("No user data found");
    }

    const userData = userDoc.data();

    // 3. Check if user is active and loginActive flags
    if (!userData.isActive || !userData.loginActive) {
      throw new Error("Your account is inactive or login is not allowed.");
    }

    // 4. Return user data
    return { uid, ...userData };

  } catch (error) {
    let message = "Failed to login. Please try again.";

    // Check Firebase Auth error codes for better message
    switch (error.code) {
      case "auth/user-not-found":
        message = "User not found. Please check your email or sign up.";
        break;
      case "auth/wrong-password":
        message = "Incorrect password. Please try again.";
        break;
      case "auth/invalid-email":
        message = "Invalid email address format.";
        break;
      case "auth/invalid-credential":
        message = "Invalid credentials provided.";
        break;
      case "auth/user-disabled":
        message = "Your account has been disabled. Contact support.";
        break;
      case "auth/too-many-requests":
        message = "Too many failed attempts. Please try again later.";
        break;
      default:
        // Use error.message if it's a custom error or unknown error
        message = error.message || message;
    }

    throw new Error(message);
  }
}