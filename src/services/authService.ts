// src/services/authService.ts

import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "@/types/auth";

// Login function
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;

    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      username: firebaseUser.displayName || undefined,
    };

    toast.success("Successfully logged in!");
    return user;
  } catch (error) {
    console.error("Login failed:", error);
    toast.error("Login failed. Please check your credentials.");
    throw error;
  }
};

// Registration
export const registerUser = async (
  email: string,
  password: string,
  username: string,
  firstName: string,
  lastName: string
): Promise<User> => {
  try {
    // 1) Create in Firebase Auth
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCred.user.uid;

    // 2) Store displayName in Firebase
    await updateProfile(userCred.user, { displayName: username });

    // 3) Insert into your MySQL via PHP endpoint
    //    ←─── FIXED URL HERE ───→
    const res = await fetch(
      "https://sanoma.adm.pizza/php/users/create_user.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          firebase_uid: uid,
          username,
          first_name: firstName,
          last_name: lastName,
        }),
      }
    );

    console.log("create_user.php status:", res.status);
    const text = await res.text();
    console.log("create_user.php response:", text);

    if (!res.ok) {
      throw new Error(`Load failed: ${res.status} ${text}`);
    }

    // 4) Return our app User
    const user: User = {
      id: uid,
      email: userCred.user.email || "",
      username,
    };

    toast.success("Successfully registered!");
    return user;
  } catch (error) {
    console.error("Registration failed:", error);
    toast.error((error as Error).message || "Registration failed");
    throw error;
  }
};

// Update username
export const updateUserUsername = async (
  userId: string,
  newUsername: string
): Promise<void> => {
  if (!auth.currentUser) throw new Error("No authenticated user");
  try {
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
