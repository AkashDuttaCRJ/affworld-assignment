"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // setIsLoading(true)

    // if (!userIdentifier.trim()) {
    //   setError("Please enter a username or email")
    //   setIsLoading(false)
    //   return
    // }

    // try {
    //   // Here you would typically call your API to handle the password reset request
    //   // For demonstration, we're just simulating an API call with a timeout
    //   await new Promise((resolve) => setTimeout(resolve, 1500))

    //   // Simulating a successful response
    //   console.log("Password reset requested for:", userIdentifier)
    //   router.push("/reset-password-confirmation")
    // } catch (err) {
    //   setError("An error occurred. Please try again.")
    // } finally {
    //   setIsLoading(false)
    // }
  };

  return (
    <div className="container h-screen mx-auto py-10 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your username or email to reset your password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userIdentifier">Username or Email</Label>
                <Input
                  id="userIdentifier"
                  type="text"
                  placeholder="Enter your username or email"
                  value={userIdentifier}
                  onChange={(e) => setUserIdentifier(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending Reset Link..." : "Reset Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
