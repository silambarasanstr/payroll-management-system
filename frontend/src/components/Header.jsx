"use client";

import { useEffect, useState } from "react";
import { UserCircle2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* Left */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Payroll Management System</h1>
        <p className="text-sm text-slate-500">Welcome back, {user?.name || "Admin"}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">{user?.name || "Admin"}</p>

            <p className="text-xs capitalize text-slate-500">{user?.role || "Administrator"}</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <UserCircle2 size={24} className="text-emerald-600" />
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
