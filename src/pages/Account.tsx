
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User as FirebaseUser, updateEmail, updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";

const Account = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || ""
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
        const usernameRef = doc(firestore, "usernames", formData.username);
        const usernameSnap = await getDoc(usernameRef);
        
        if (usernameSnap.exists() && usernameSnap.data().uid !== user.id) {
          toast.error("Username already taken");
          setIsLoading(false);
          return;
        }
        
        // Remove old username reference
        if (user.username) {
          const oldUsernameRef = doc(firestore, "usernames", user.username);
          await updateDoc(oldUsernameRef, { uid: null });
        }
        
        // Set new username reference
        await updateDoc(usernameRef, {
          uid: user.id
        });
        
        // Update user document
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
            Update your account details
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
                required
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
                required
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
