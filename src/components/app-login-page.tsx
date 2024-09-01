"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AppLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check if email is stored in localStorage
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);

      // Show success toast
      toast.success("Login successful!");

      // Store email in localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Handle successful login (e.g., redirect, store token, etc.)
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      // Show error toast
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <Image
              src="/infloso.png"
              alt="MelodyVerse"
              width={80}
              height={80}
            />
            <h1 className="text-3xl font-bold text-blue-700">MelodyVerse</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Log in to your account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember Me
                </label>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                type="submit"
              >
                Log in
              </Button>
            </div>
          </form>
          <ToastContainer />
          <div className="mt-4 text-center">
            <Link
              className="text-sm text-blue-600 hover:underline"
              href="/forgot-password"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button variant="outline">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              Don't have an account?
            </span>{" "}
            <Link className="text-sm text-blue-600 hover:underline" href="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
