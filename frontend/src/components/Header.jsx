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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      {/* Left - Brand */}
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-gray-900">Payroll Management System</h2>

        <p className="mt-0.5 text-[11px] text-gray-400">Admin Dashboard</p>
      </div>

      {/* Right - User */}
      <div className="flex items-center gap-3">
        {/* User Info */}
        <div className="hidden text-right sm:block">
          <p className="text-xs font-semibold text-gray-800">{user?.name || "Admin"}</p>

          <p className="mt-0.5 text-[10px] capitalize text-gray-400">{user?.role || "Administrator"}</p>
        </div>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
          <UserCircle2 size={21} strokeWidth={1.8} className="text-emerald-600" />
        </div>

        {/* Divider */}
        <div className="hidden h-7 w-px bg-gray-200 sm:block" />

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
