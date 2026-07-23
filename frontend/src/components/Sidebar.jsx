"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarCheck, CalendarClock, Wallet, FileText, Settings, BriefcaseBusiness } from "lucide-react";
import authService from "@/services/authService";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Employees", icon: Users, href: "/employees" },
  { name: "Attendance", icon: CalendarCheck, href: "/attendance" },
  { name: "Leaves", icon: CalendarClock, href: "/leaves" },
  { name: "Payroll", icon: Wallet, href: "/payroll" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Failed to fetch sidebar profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <aside className="w-56 bg-emerald-700 text-emerald-50 flex flex-col font-sans">
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-5 border-b border-emerald-800">
        <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center">
          <BriefcaseBusiness size={20} className="text-white" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white tracking-wide leading-tight">Payroll</h2>
          <p className="text-[10px] text-emerald-150">Management System</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer
              ${active ? "bg-white text-emerald-700 shadow-sm" : "hover:bg-emerald-600 hover:text-white"}`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-emerald-600 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-emerald-700 font-bold shadow-inner">
            {firstLetter}
          </div>

          <div>
            <p className="text-sm font-semibold text-white truncate max-w-[120px]">{user?.name || "Admin"}</p>
            <p className="text-xs text-emerald-150 capitalize">{user?.role || "Administrator"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
