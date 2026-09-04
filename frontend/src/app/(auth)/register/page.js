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
    role: "employee",
    employee: "",
  });

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
      return;
    }

    const timer = setTimeout(() => {
      setChecking(false);
    }, 0);

    return () => clearTimeout(timer);
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
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
        {/* Header / Logo */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 shadow-md">
            <BriefcaseBusiness size={24} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>

          <p className="mt-1 text-sm text-slate-500">Register a new user account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              required
              placeholder="Enter name"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              required
              placeholder="Enter email"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="off"
              required
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              autoComplete="off"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="admin">Admin</option>
              <option value="hr">HR Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Employee ID */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Employee ID</label>

            <input
              type="text"
              name="employee"
              value={form.employee}
              onChange={handleChange}
              autoComplete="off"
              required
              placeholder="Enter Employee MongoDB ID"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-600/10 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}

            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
