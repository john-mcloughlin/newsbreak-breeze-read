import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserUsername,
} from "@/services/authService";
import { User, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          id: fbUser.uid,
          email: fbUser.email || "",
          username: fbUser.displayName || undefined,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const u = await loginUser(email, password);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string
  ) => {
    setLoading(true);
    try {
      const u = await registerUser(
        email,
        password,
        username,
        firstName,
        lastName
      );
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  // Update username
  const updateUsername = async (username: string) => {
    if (!user) throw new Error("No user to update");
    setLoading(true);
    try {
      await updateUserUsername(user.id, username);
      setUser({ ...user, username });
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, updateUsername, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
