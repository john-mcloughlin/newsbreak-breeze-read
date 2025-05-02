
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // Check username availability when username changes
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      // Reset state
      setUsernameAvailable(null);
      
      // Only check if username has at least 3 characters
      if (username.length < 3) return;
      
      setCheckingUsername(true);
      try {
        const usernameRef = doc(firestore, "usernames", username);
        const usernameSnap = await getDoc(usernameRef);
        setUsernameAvailable(!usernameSnap.exists());
      } catch (err) {
        console.error("Error checking username:", err);
      } finally {
        setCheckingUsername(false);
      }
    };

    // Debounce check to avoid too many requests
    const timeoutId = setTimeout(checkUsernameAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    
    if (!usernameAvailable) {
      setError("This username is already taken. Please choose another one.");
      return;
    }
    
    try {
      await register(email, password, username);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nbBackground p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-nbBlue-700">news.break</h1>
          <p className="text-nbTextLight mt-2">Take control of your news consumption</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Join news.break to start managing your reading backlog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-50 text-red-500 rounded">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Choose a unique username"
                    className={username.length > 2 ? (usernameAvailable ? "pr-10 border-green-500" : "pr-10 border-red-500") : ""}
                    minLength={3}
                  />
                  {username.length > 2 && !checkingUsername && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {usernameAvailable ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {username.length > 2 && !checkingUsername && (
                  <div className="text-xs">
                    {usernameAvailable ? 
                      <span className="text-green-600">Username available!</span> : 
                      <span className="text-red-600">Username already taken</span>
                    }
                  </div>
                )}
                <p className="text-xs text-nbTextLight">This will be your unique identifier on news.break</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading || (username.length > 2 && !usernameAvailable)}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              
              <div className="text-center text-sm mt-4">
                <span className="text-nbTextLight">Already have an account? </span>
                <Link to="/login" className="text-nbBlue-600 hover:text-nbBlue-800">
                  Log in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
