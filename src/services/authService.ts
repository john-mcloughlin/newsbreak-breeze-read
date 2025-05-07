
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "@/types/auth";

const API_BASE = import.meta.env.VITE_APP_API_BASE || "https://sanoma.adm.pizza";

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

// Register function
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

    // 2) Set displayName in Firebase
    await updateProfile(userCred.user, { displayName: username });

    // 3) Insert into MySQL via your PHP endpoint
    const res = await fetch(`${API_BASE}/users/create_user.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        firebase_uid: uid,
        username,
        name: firstName,
        surname: lastName,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      throw new Error(data.message || `Create failed: ${res.status}`);
    }

    // 4) Return our app User object
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
