import React, { useState } from "react";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Label from "../components/ui/Lable";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      (
        window as typeof window & {
          appToast?: (msg: string, type: string) => void;
        }
      ).appToast?.("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      (
        window as typeof window & {
          appToast?: (msg: string, type: string) => void;
        }
      ).appToast?.("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/register`, { username, password });
      (
        window as typeof window & {
          appToast?: (msg: string, type: string) => void;
        }
      ).appToast?.("Account created successfully! Please sign in.", "success");
      nav("/login");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      (
        window as typeof window & {
          appToast?: (msg: string, type: string) => void;
        }
      ).appToast?.(
        error?.response?.data?.message || "Registration failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 shadow-lg flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-4">
            🍯
          </div>
          <h1 className="text-3xl font-display text-slate-900 mb-2">
            Join Sweetly
          </h1>
          <p className="text-slate-600">Create your account to get started</p>
        </div>

        <Card className="w-full bg-white shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-slate-900">
              Create Account
            </CardTitle>
            <p className="text-slate-600">
              Fill in your details to create your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create a password (min 6 characters)"
                  required
                />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                <div className="text-center">
                  <span className="text-slate-600">
                    Already have an account?{" "}
                  </span>
                  <Link
                    to="/login"
                    className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
