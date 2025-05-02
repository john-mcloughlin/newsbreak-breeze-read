
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User as FirebaseUser, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";

const Account = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Update username if changed
      if (user.username !== formData.username && formData.username.trim()) {
        // Check if username is available
        const userRef = doc(firestore, "users", user.id);
        await updateDoc(userRef, {
          username: formData.username
        });
        
        // Update Firebase profile
        await updateProfile(auth.currentUser as FirebaseUser, {
          displayName: formData.username
        });
        
        toast.success("Username updated successfully");
      }
      
      // Update email if changed
      if (user.email !== formData.email && formData.email) {
        await updateEmail(auth.currentUser as FirebaseUser, formData.email);
        toast.success("Email updated successfully");
      }
      
      // Update password if provided
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
        
        await updatePassword(auth.currentUser as FirebaseUser, formData.password);
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        toast.success("Password updated successfully");
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. You may need to re-authenticate.");
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
            Update your account details and password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Account;
