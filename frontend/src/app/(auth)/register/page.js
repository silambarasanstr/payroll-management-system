
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authService from "@/services/authService";
import { BriefcaseBusiness, Loader2 } from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
      return;
    }

    setChecking(false);
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.register(form);

      alert(res.message || "User registered successfully");
      router.push("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-3">
      <div className="w-full max-w-sm rounded-xl border border-slate-100 bg-white p-5 shadow-lg">

        {/* Header */}
        <div className="mb-5 flex flex-col items-center">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
            <BriefcaseBusiness size={19} className="text-white" />
          </div>

          <h1 className="text-xl font-bold text-slate-800">
            Create Account
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Register a new user account
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              required
              placeholder="Enter name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              required
              placeholder="Enter email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="off"
              required
              placeholder="Enter password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && (
              <Loader2 size={14} className="animate-spin" />
            )}

            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 border-t border-slate-100 pt-3 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
