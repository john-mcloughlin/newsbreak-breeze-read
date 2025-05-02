
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import { User, AuthContextType } from "@/types/auth";
import { loginUser, registerUser, updateUserUsername, logoutUser } from "@/services/authService";

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
      const userData = await loginUser(email, password);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function with username logic
  const register = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      const userData = await registerUser(email, password, username);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update username function
  const updateUsername = async (newUsername: string) => {
    if (!user) {
      throw new Error("No authenticated user");
    }
    
    try {
      await updateUserUsername(user.id, newUsername);
      setUser(prev => prev ? { ...prev, username: newUsername } : null);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUsername, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
