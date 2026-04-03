import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";

const TOKEN_KEY = "nestmate_token";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailAuth(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await api.post("/api/auth/login", { email, password });
        localStorage.setItem(TOKEN_KEY, res.data.token);
      } else {
        const res = await api.post("/api/auth/register", { email, password });
        localStorage.setItem(TOKEN_KEY, res.data.token);
      }
      await refreshUser();
      navigate("/matches");
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
              N
            </div>
            <span className="text-xl font-bold text-gray-900">NestMate</span>
          </div>
          <div className="flex items-center gap-4">
            {mode === "login" ? (
              <button onClick={() => setMode("signup")} className="text-gray-600 hover:text-gray-900 font-medium">
                Register
              </button>
            ) : (
              <button onClick={() => setMode("login")} className="text-gray-600 hover:text-gray-900 font-medium">
                Login
              </button>
            )}
            <Button variant="primary" size="sm">Download App</Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                ✓ Trusted by thousands of users
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900">
                Find your perfect roommate
              </h1>
              <p className="text-xl text-gray-600">
                Connect with compatible roommates based on budget, location & lifestyle
              </p>
            </div>

            {/* Search */}
            <div className="flex gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search places..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Button variant="primary" size="md" className="px-6">
                Search
              </Button>
            </div>

            {/* Top Cities */}
            <div className="pt-4">
              <p className="text-gray-600 text-sm">
                Top Cities: <span className="font-medium">
                  <button className="text-primary-600 hover:underline">Delhi</button>, 
                  <button className="text-primary-600 hover:underline ml-1">Bangalore</button>, 
                  <button className="text-primary-600 hover:underline ml-1">Mumbai</button>
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Login/Register Section */}
        <div className="py-12">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                  onClick={() => setMode("login")}
                  className={`pb-4 font-medium text-sm transition-colors ${
                    mode === "login"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`pb-4 font-medium text-sm transition-colors ${
                    mode === "signup"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form className="space-y-4" onSubmit={handleEmailAuth}>
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-500">or continue with</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Google Login */}
              <Button variant="secondary" size="md" className="w-full">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

