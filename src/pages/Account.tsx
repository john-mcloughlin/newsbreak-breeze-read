import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { AlertCircle, Check } from "lucide-react";

const Account = () => {
  const { user, updateUsername } = useAuth();
  
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || ""
      });
    }
  }, [user]);
  
  // Check username availability when username changes
  useEffect(() => {
    // Skip check if username hasn't changed or is too short
    if (!user || formData.username === user.username || formData.username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    const checkUsernameAvailability = async () => {
      setCheckingUsername(true);
      try {
        const usernameRef = doc(firestore, "usernames", formData.username);
        const usernameSnap = await getDoc(usernameRef);
        
        // Username is available if document doesn't exist or belongs to current user
        const isAvailable = !usernameSnap.exists() || 
                           (usernameSnap.exists() && usernameSnap.data()?.uid === user.id);
                           
        setUsernameAvailable(isAvailable);
      } catch (err) {
        console.error("Error checking username:", err);
      } finally {
        setCheckingUsername(false);
      }
    };
    
    // Debounce check to avoid too many requests
    const timeoutId = setTimeout(checkUsernameAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Check if username is available when it's changed
    if (formData.username !== user.username && !usernameAvailable) {
      toast.error("Username is already taken");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Update username if changed
      if (user.username !== formData.username && formData.username.trim()) {
        await updateUsername(formData.username);
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      // Error message will be handled by the updateUsername function
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return <div className="text-center py-10">Loading user data...</div>;
  }
  
  return (
    <div className="nb-container pt-6 pb-20 max-w-2xl">
      <h1 className="text-2xl font-bold text-nbText mb-6">My Account</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account details
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  minLength={3}
                  className={formData.username !== user.username ? 
                    (usernameAvailable ? "pr-10 border-green-500" : "pr-10 border-red-500") : ""}
                />
                {formData.username !== user.username && formData.username.length >= 3 && !checkingUsername && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {usernameAvailable ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {formData.username !== user.username && formData.username.length >= 3 && !checkingUsername && (
                <div className="text-xs">
                  {usernameAvailable ? 
                    <span className="text-green-600">Username available!</span> : 
                    <span className="text-red-600">Username already taken</span>
                  }
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed directly. Please contact support.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isLoading || (formData.username !== user.username && !usernameAvailable)}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Account;
