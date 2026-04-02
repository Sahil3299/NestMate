import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const TOKEN_KEY = "nestmate_token";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "signup"
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
      // Ensure AuthContext re-validates so ProtectedRoute allows navigation.
      await refreshUser();
      navigate("/profile");
    } catch (err) {
      setError(err?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl p-6 bg-white/90">
        <h1 className="text-2xl font-semibold mb-4">NestMate</h1>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`px-3 py-2 rounded-lg border flex-1 ${mode === "login" ? "bg-purple-600 text-white border-purple-600" : "bg-white"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded-lg border flex-1 ${mode === "signup" ? "bg-purple-600 text-white border-purple-600" : "bg-white"}`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <label className="block">
            <div className="text-sm mb-1">Email</div>
            <input
              className="w-full border rounded-lg px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <div className="text-sm mb-1">Password</div>
            <input
              className="w-full border rounded-lg px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

      </div>
    </div>
  );
}

