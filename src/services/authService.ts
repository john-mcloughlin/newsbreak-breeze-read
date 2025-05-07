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
  } catch (error: any) {
    console.error("Login failed:", error);
    toast.error("Login failed. Please check your credentials.");
    throw error;
  }
};

// Register function (now takes name & surname)
export const registerUser = async (
  email: string,
  password: string,
  username: string,
  name: string,
  surname: string
): Promise<User> => {
  try {
    // 1) Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;
    const uid = firebaseUser.uid;

    // 2) Update displayName in Firebase
    await updateProfile(firebaseUser, { displayName: username });

    // 3) Save profile in MySQL via your PHP script
    const res = await fetch(
      "https://sanoma.adm.pizza/create_user.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          firebase_uid: uid,
          username,
          name,
          surname,
        }),
      }
    );

    if (res.status === 201) {
      toast.success("Successfully registered!");
    } else if (res.status === 409) {
      toast.error("Username already taken");
      throw new Error("Username already taken");
    } else {
      const text = await res.text();
      toast.error("Profile save failed: " + text);
      throw new Error(text);
    }

    // 4) Return our app‐level user object
    return {
      id: uid,
      email: firebaseUser.email || "",
      username,
      name,
      surname,
    };
  } catch (error: any) {
    console.error("Registration failed:", error);
    toast.error(error.message || "Registration failed");
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
  } catch (error: any) {
    console.error("Failed to update username:", error);
    toast.error(error.message || "Failed to update username");
    throw error;
  }
};

// Logout
export const logoutUser = (): void => {
  signOut(auth);
  toast.info("You have been logged out");
};
