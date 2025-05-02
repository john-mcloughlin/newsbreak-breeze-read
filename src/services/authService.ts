
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import { User } from "@/types/auth";

// Login function
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;

    const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));

    const user = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      username: userDoc.exists() ? userDoc.data()?.username : undefined
    };

    toast.success("Successfully logged in!");
    return user;
  } catch (error) {
    console.error("Login failed:", error);
    toast.error("Login failed. Please check your credentials.");
    throw error;
  }
};

// Register function
export const registerUser = async (email: string, password: string, username: string): Promise<User> => {
  try {
    // Check username availability
    const usernameRef = doc(firestore, "usernames", username);
    const usernameSnap = await getDoc(usernameRef);

    if (usernameSnap.exists()) {
      throw new Error("Username already taken");
    }

    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Reserve username
    await setDoc(usernameRef, {
      uid: uid
    });

    // Create user profile
    await setDoc(doc(firestore, "users", uid), {
      username: username,
      email: userCredential.user.email,
      createdAt: serverTimestamp(),
    });

    // Update displayName
    await updateProfile(userCredential.user, {
      displayName: username
    });

    const user = {
      id: uid,
      email: userCredential.user.email || "",
      username: username
    };

    toast.success("Successfully registered!");
    return user;
  } catch (error) {
    console.error("Registration failed:", error);
    toast.error((error as Error).message);
    throw error;
  }
};

// Update username
export const updateUserUsername = async (userId: string, newUsername: string): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user");
  }
  
  try {
    // Check if the new username is already taken
    const usernameRef = doc(firestore, "usernames", newUsername);
    const usernameSnap = await getDoc(usernameRef);
    
    if (usernameSnap.exists()) {
      throw new Error("Username already taken");
    }
    
    // Update the user document first (allowed because we're the owner)
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, { username: newUsername });
    
    // Create new username document and point it to this user
    await setDoc(usernameRef, { uid: userId });
    
    // Update Firebase Auth display name
    await updateProfile(auth.currentUser, { displayName: newUsername });
    
    toast.success("Username updated successfully");
  } catch (error) {
    console.error("Failed to update username:", error);
    toast.error((error as Error).message || "Failed to update username");
    throw error;
  }
};

// Logout function
export const logoutUser = (): void => {
  signOut(auth);
  toast.info("You have been logged out");
};
