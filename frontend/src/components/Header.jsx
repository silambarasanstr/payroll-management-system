"use client";

import { UserCircle2, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-14  bg-slate-50 border-b border-slate-200 px-6 flex items-center justify-between">

      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Payroll Management
        </h1>
        <p className="text-xs text-slate-500">
          Admin Dashboard
        </p>
      </div>

      <div className="flex items-center gap-5">

  {/* Notification */}
  <button className="relative rounded-full p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600">
    <Bell size={20} />
    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
  </button>

  {/* Profile */}
  <div className="flex items-center gap-3  ">
    <div className="text-right leading-tight">
      <p className="text-sm font-semibold text-slate-800">
        Admin
      </p>
      <p className="text-xs text-slate-500">
        Administrator
      </p>
    </div>

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
      <UserCircle2 className="text-emerald-600" size={26} />
    </div>
  </div>

</div>
    </header>
  );
}