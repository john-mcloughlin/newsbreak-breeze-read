// src/pages/Register.tsx

import { useState } from "react";
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
import { AlertCircle, Check } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValidUsername, setIsValidUsername] = useState<boolean | null>(null);

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validateUsername = (value: string) => {
    if (value.length >= 3) setIsValidUsername(true);
    else setIsValidUsername(null);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    validateUsername(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!name.trim() || !surname.trim()) {
      setError("Both first and last name are required");
      return;
    }

    try {
      // pass name + surname into register
      await register(email, password, username, name, surname);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nbBackground p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-nbBlue-700">news.break</h1>
          <p className="text-nbTextLight mt-2">
            Take control of your news consumption
          </p>
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

              {/* First name */}
              <div className="space-y-2">
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Last name */}
              <div className="space-y-2">
                <Label htmlFor="surname">Last Name</Label>
                <Input
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                    placeholder="Choose a unique username"
                    className={
                      username.length > 2
                        ? isValidUsername
                          ? "pr-10 border-green-500"
                          : "pr-10"
                        : ""
                    }
                    minLength={3}
                  />
                  {username.length > 2 && isValidUsername && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-nbTextLight">
                  This will be your unique identifier on news.break
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>

              <div className="text-center text-sm mt-4">
                <span className="text-nbTextLight">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-nbBlue-600 hover:text-nbBlue-800"
                >
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
