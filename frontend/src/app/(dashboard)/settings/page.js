"use client";

import { useState } from "react";
import {
  Loader2,
  
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    companyName: "Corporation",
    regId: "REG-99120-X",
    email: "contact@acme.org",
    currency: "INR",
    taxRate: 10,
    pfRate: 12,
    workHours: 8,
    workDays: 22,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: ["taxRate", "pfRate", "workHours", "workDays"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Settings Saved Successfully");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        subtitle="Configure organisation and payroll settings"
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        
        <div className="lg:col-span-8 space-y-6">
          {/* Organisation */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2  pb-3 mb-5">
              
              <h2 className="text-base font-bold text-slate-800"> 
                Organisation Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 font-medium">
                  Company Name
                </label>

                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full h-9 rounded border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Registration ID
                </label>

                <input
                  name="regId"
                  value={form.regId}
                  onChange={handleChange}
                  className="w-full h-9 rounded border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1 font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full h-9 rounded border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Payroll */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2  pb-3 mb-5">
              
              <h2 className="text-base font-bold text-slate-800">
                Payroll & Taxes
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1 font-medium">
                  Currency
                </label>

                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="w-full h-9 rounded border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Tax Rate (%)
                </label>

                <input
                  type="number"
                  name="taxRate"
                  value={form.taxRate}
                  onChange={handleChange}
                  className="w-full h-9 rounded border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  PF (%)
                </label>

                <input
                  type="number"
                  name="pfRate"
                  value={form.pfRate}
                  onChange={handleChange}
                  className="w-full h-9 rounded border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2  pb-3 mb-5">
             
              <h2 className="text-base font-bold text-slate-800">
                Attendance Policy
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 font-medium">
                  Working Hours
                </label>

                <input
                  type="number"
                  name="workHours"
                  value={form.workHours}
                  onChange={handleChange}
                  className="w-full h-9 rounded border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Working Days
                </label>

                <input
                  type="number"
                  name="workDays"
                  value={form.workDays}
                  onChange={handleChange}
                  className="w-full h-9 rounded border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-6 py-2.5 flex items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Save Settings
            </button>
          </div>
        </div>

       
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm sticky top-5">
            <div className="flex items-center gap-2  pb-3 mb-5">
             
              <h2 className="text-base font-bold text-slate-800">
                Settings Summary
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-slate-500">Company</p>
                <p className="text-base ">{form.companyName}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Registration ID</p>
                <p className="text-base ">{form.regId}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-base break-all">{form.email}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Currency</p>
                <p className="text-base">{form.currency}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Tax Rate</p>
                <p className="text-base">{form.taxRate}%</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">PF Rate</p>
                <p className="text-base">{form.pfRate}%</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Working Hours</p>
                <p className="text-base">
                  {form.workHours} Hours / Day
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Working Days</p>
                <p className="text-base">
                  {form.workDays} Days / Month
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}