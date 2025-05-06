
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User, AuthContextType } from "@/types/auth";
import { loginUser, registerUser, logoutUser, updateUserUsername } from "@/services/authService";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase user to our User type
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          username: firebaseUser.displayName || undefined,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error("Login error in context:", error);
      throw error;
    }
  };

  // Register function
  const register = async (email: string, password: string, username: string) => {
    try {
      const user = await registerUser(email, password, username);
      setUser(user);
      return user;
    } catch (error) {
      console.error("Registration error in context:", error);
      throw error;
    }
  };

  // Update username function
  const updateUsername = async (username: string) => {
    try {
      if (user) {
        await updateUserUsername(user.id, username);
        // Update local state with new username
        setUser({ ...user, username });
      }
    } catch (error) {
      console.error("Update username error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    updateUsername,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
