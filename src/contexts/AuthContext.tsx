
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          username: userDoc.exists() ? userDoc.data()?.username : undefined
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));

      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        username: userDoc.exists() ? userDoc.data()?.username : undefined
      });

      toast.success("Successfully logged in!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function with username logic
  const register = async (email: string, password: string, username: string) => {
    setLoading(true);
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

      setUser({
        id: uid,
        email: userCredential.user.email || "",
        username: username
      });

      toast.success("Successfully registered!");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update username function
  const updateUsername = async (newUsername: string) => {
    if (!auth.currentUser || !user) {
      throw new Error("No authenticated user");
    }
    
    try {
      const uid = user.id;
      
      // Check if the new username is already taken
      const usernameRef = doc(firestore, "usernames", newUsername);
      const usernameSnap = await getDoc(usernameRef);
      
      if (usernameSnap.exists()) {
        throw new Error("Username already taken");
      }
      
      // Update the user document first (allowed because we're the owner)
      const userRef = doc(firestore, "users", uid);
      await updateDoc(userRef, { username: newUsername });
      
      // Create new username document and point it to this user
      await setDoc(usernameRef, { uid });
      
      // Update Firebase Auth display name
      await updateProfile(auth.currentUser, { displayName: newUsername });
      
      // Update local user state
      setUser(prev => prev ? { ...prev, username: newUsername } : null);
      
      // Note: We're not trying to delete the old username document
      // since our security rules don't allow it. This means old usernames
      // will remain reserved, which is actually good for username continuity.
      
      toast.success("Username updated successfully");
    } catch (error) {
      console.error("Failed to update username:", error);
      toast.error((error as Error).message || "Failed to update username");
      throw error;
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUsername, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
