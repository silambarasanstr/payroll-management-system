
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import { BriefcaseBusiness, Loader2 } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fillCredentials = (email, password) => {
    setForm({ email, password });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.replace("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
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
            Welcome Back
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Sign in to manage your payroll account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3">

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
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
              autoComplete="off"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
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

            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Quick Login */}
        <div className="mt-4 border-t border-slate-100 pt-3">

          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Quick Login
            </p>

            <span className="text-[10px] text-slate-400">
              Click to autofill
            </span>
          </div>

          <div className="space-y-1.5">

            {/* Admin */}
            <button
              type="button"
              onClick={() =>
                fillCredentials("admin@example.com", "123456")
              }
              className="cursor-pointer flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800">
                  👨‍💼 Admin
                </p>

                <p className="text-[10px] text-slate-500">
                  admin@example.com
                </p>
              </div>

              <span className="rounded bg-emerald-100 px-2 py-1 text-[9px] font-semibold text-emerald-700">
                USE
              </span>
            </button>

            {/* Member */}
            <button
              type="button"
              onClick={() =>
                fillCredentials("member@example.com", "123456")
              }
              className="cursor-pointer flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800">
                  👤 Member
                </p>

                <p className="text-[10px] text-slate-500">
                  member@example.com
                </p>
              </div>

              <span className="rounded bg-emerald-100 px-2 py-1 text-[9px] font-semibold text-emerald-700">
                USE
              </span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
