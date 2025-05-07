
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "@/types/auth";

// Simulated username storage (would typically be in your new database)
const usernames = new Set();

// Login function
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;

    const user = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      username: firebaseUser.displayName || undefined
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
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

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
