import React, { useState } from "react";
import api from "../api/axios";
import useAuth from "../context/useAuth";
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

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/auth/login`, { username, password });
      login(res.data.token);
      (
        window as typeof window & {
          appToast?: (msg: string, type: string) => void;
        }
      ).appToast?.("Welcome back! 🎉", "success");
      nav("/");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      (
        window as typeof window & {
          appToast?: (msg: string, type: string) => void;
        }
      ).appToast?.(error?.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-medium flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-4">
            🍯
          </div>
          <h1 className="text-3xl font-display text-primary-800 mb-2">
            Welcome to Sweetly
          </h1>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <p className="text-slate-600">
              Enter your credentials to access your account
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="text-center">
                  <span className="text-slate-600">
                    Don't have an account?{" "}
                  </span>
                  <Link
                    to="/register"
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    Sign up here
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
