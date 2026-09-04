"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarCheck, CalendarClock, Wallet, BriefcaseBusiness } from "lucide-react";
import authService from "@/services/authService";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Employees",
    icon: Users,
    href: "/employees",
  },
  {
    name: "Attendance",
    icon: CalendarCheck,
    href: "/attendance",
  },
  {
    name: "Leaves",
    icon: CalendarClock,
    href: "/leaves",
  },
  {
    name: "Payroll",
    icon: Wallet,
    href: "/payroll",
  },
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
    <aside className="flex w-52 shrink-0 flex-col bg-emerald-700 font-sans text-emerald-50">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-emerald-800 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500">
          <BriefcaseBusiness size={18} className="text-white" />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold leading-tight tracking-wide text-white">Payroll</h2>

          <p className="text-[9px] leading-tight text-emerald-100">Management System</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-3">
        <div className="space-y-0.5">
          {menu.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
                  active ? "bg-white text-emerald-700 shadow-sm" : "text-emerald-50 hover:bg-emerald-600 hover:text-white"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} className="shrink-0" />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Footer */}
      <div className="shrink-0 border-t border-emerald-600 p-3">
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700">{firstLetter}</div>

          {/* User Info */}
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">{user?.name || "Admin"}</p>

            <p className="truncate text-[10px] capitalize text-emerald-100">{user?.role || "Administrator"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
