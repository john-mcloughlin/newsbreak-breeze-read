import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import { User } from "@/types/auth";

// ---------------------------
// LOGIN USER
// ---------------------------

export const loginUser = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;

  // Fetch user profile from Firestore
  const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    username: userDoc.exists() ? userDoc.data()?.username : undefined,
  };
};

// ---------------------------
// REGISTER USER
// ---------------------------

export const registerUser = async (email: string, password: string, username: string): Promise<User> => {
  // Check if username exists
  const usernameRef = doc(firestore, "usernames", username.toLowerCase());
  const usernameSnap = await getDoc(usernameRef);

  if (usernameSnap.exists()) {
    throw new Error("Username already taken");
  }

  // Create new user with Firebase Auth
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;

  // Claim the username
  await setDoc(usernameRef, {
    uid: firebaseUser.uid,
  });

  // Create user profile in Firestore
  await setDoc(doc(firestore, "users", firebaseUser.uid), {
    username: username,
    email: firebaseUser.email,
    createdAt: serverTimestamp(),
  });

  // Update Firebase Auth display name
  await updateProfile(firebaseUser, {
    displayName: username,
  });

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    username: username,
  };
};

// ---------------------------
// UPDATE USER USERNAME
// ---------------------------

export const updateUserUsername = async (userId: string, username: string) => {
  // Update Firestore user profile → SAFE (no document error)
  await setDoc(doc(firestore, "users", userId), {
    username
  }, { merge: true });

  // Optionally update Firebase Auth profile displayName
  const firebaseUser = auth.currentUser;
  if (firebaseUser?.uid === userId) {
    await updateProfile(firebaseUser, {
      displayName: username,
    });
  }
};

// ---------------------------
// LOGOUT USER
// ---------------------------

export const logoutUser = async () => {
  await signOut(auth);
};
