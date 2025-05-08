
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Check } from "lucide-react";

const Account = () => {
  const { user, updateUsername } = useAuth();
  
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || ""
      });
    }
  }, [user]);
  
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
        await updateUsername(formData.username);
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      // Error is already handled in the updateUsername function
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
                  className={formData.username !== user.username ? "pr-10 border-green-500" : ""}
                />
                {formData.username !== user.username && formData.username.length >= 3 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
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
                className="bg-gray-100 dark:bg-gray-800 text-foreground"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isLoading || formData.username === user.username}
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
