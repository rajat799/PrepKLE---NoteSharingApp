import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";

const provider = new GoogleAuthProvider();

/**
 * Sign in with Google popup.
 * Returns the authenticated User object.
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/**
 * Sign out the current user.
 */
export async function logOut(): Promise<void> {
  await signOut(auth);
}

