// frontend/src/pages/AuthPages.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, registerSchema } from "@/validators/schemas";
import { Spinner } from "@/components/ui";

// ── Shared field component ─────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div>
    <label className="label">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Login Page ─────────────────────────────────────────────────────────────
export function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/listings";
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your Nestmate account</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Email address" error={errors.email?.message}>
            <input {...register("email")} type="email" placeholder="you@example.com" className="input" autoComplete="email" />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <input {...register("password")} type="password" placeholder="••••••••" className="input" autoComplete="current-password" />
          </Field>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</Link>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3 mt-2">
            {isSubmitting ? <><Spinner className="w-4 h-4 text-white" /> Signing in…</> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700">Create one free</Link>
        </p>
      </div>
    </div>
  );
}

// ── Register Page ──────────────────────────────────────────────────────────
export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "seeker" },
  });

  const role = watch("role");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await registerUser(data);
      navigate("/listings");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Find your perfect flatmate today</p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
          {[
            { value: "seeker", label: "🔍 I Need a Room" },
            { value: "host",   label: "🏠 I Have a Room" },
          ].map(({ value, label }) => (
            <label key={value} className={`flex items-center justify-center py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${role === value ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              <input {...register("role")} type="radio" value={value} className="sr-only" />
              {label}
            </label>
          ))}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Full name" error={errors.name?.message}>
            <input {...register("name")} placeholder="Priya Sharma" className="input" autoComplete="name" />
          </Field>
          <Field label="Email address" error={errors.email?.message}>
            <input {...register("email")} type="email" placeholder="you@example.com" className="input" autoComplete="email" />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <input {...register("password")} type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" className="input" autoComplete="new-password" />
          </Field>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3 mt-2">
            {isSubmitting ? <><Spinner className="w-4 h-4 text-white" /> Creating account…</> : "Create Free Account"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          By signing up you agree to our{" "}
          <Link to="/terms" className="underline">Terms</Link> and{" "}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
