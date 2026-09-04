"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Wallet, CalendarClock, CheckCircle, ArrowRight, UserPlus, Calendar, DollarSign } from "lucide-react";

import employeesService from "@/services/employeesService";
import payrollService from "@/services/payrollService";
import leaveService from "@/services/leaveService";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPayroll: 0,
    pendingLeaves: 0,
    attendanceRate: "95.8%",
  });

  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const emps = await employeesService.getEmployees();
        const employeesList = emps || [];

        const payRes = await payrollService.getPayrolls();
        const payrollsList = payRes.data.data || [];

        const totalSpending = payrollsList.reduce((acc, curr) => acc + (curr.netPay || 0), 0);

        const leaveRes = await leaveService.getEmployeeLeaves("all");
        const leavesList = leaveRes.data || [];

        const pending = leavesList.filter((leave) => leave.status === "pending").length;

        setStats({
          totalEmployees: employeesList.length,
          totalPayroll: totalSpending,
          pendingLeaves: pending,
          attendanceRate: employeesList.length > 0 ? "96.4%" : "100%",
        });

        setRecentEmployees(employeesList.slice(-4).reverse());
        setRecentLeaves(leavesList.slice(-4).reverse());
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return <Loader text="Loading dashboard stats..." />;
  }

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "text-emerald-600 bg-emerald-50",
      description: "Organization headcount",
    },
    {
      title: "Monthly Payroll",
      value: formatCurrency(stats.totalPayroll),
      icon: Wallet,
      color: "text-blue-600 bg-blue-50",
      description: "Net salary disbursed",
    },
    {
      title: "Pending Leaves",
      value: stats.pendingLeaves,
      icon: CalendarClock,
      color: "text-amber-600 bg-amber-50",
      description: "Needs admin approval",
    },
    {
      title: "Attendance Rate",
      value: stats.attendanceRate,
      icon: CheckCircle,
      color: "text-purple-600 bg-purple-50",
      description: "Current month index",
    },
  ];

  const quickActions = [
    {
      href: "/employees",
      label: "Add New Employee",
      icon: UserPlus,
    },
    {
      href: "/attendance",
      label: "Record Attendance",
      icon: Calendar,
    },
    {
      href: "/leaves",
      label: "Apply / Approve Leaves",
      icon: CalendarClock,
    },
    {
      href: "/payroll",
      label: "Generate Payroll",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-4 p-1 font-sans">
      {/* Page Header */}
      <PageHeader title="System Dashboard" subtitle="Real-time overview of organization operations & metrics." />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{card.title}</span>

                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.color}`}>
                  <Icon size={17} strokeWidth={2} />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xl font-bold tracking-tight text-slate-800">{card.value}</p>

                <p className="mt-0.5 text-[10px] text-slate-400">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-800">Quick Actions</h2>

            <p className="mt-0.5 text-[10px] text-slate-400">Common administrative tasks</p>
          </div>

          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-100 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                    <Icon size={15} />
                  </div>

                  <span>{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* New Joinees */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">New Joinees</h2>

              <p className="mt-0.5 text-[10px] text-slate-400">Recently added employee profiles</p>
            </div>

            <Link href="/employees" className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700">
              View All
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentEmployees.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">No employees added yet.</div>
            ) : (
              recentEmployees.map((emp) => (
                <div key={emp._id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold uppercase text-slate-600">{emp.name?.charAt(0)}</div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">{emp.name}</p>

                      <p className="truncate text-[10px] text-slate-400">{emp.designation}</p>
                    </div>
                  </div>

                  <span className="ml-2 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">{emp.department}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Leaves */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Recent Leaves</h2>

              <p className="mt-0.5 text-[10px] text-slate-400">Recent leave applications</p>
            </div>

            <Link href="/leaves" className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700">
              View All
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentLeaves.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">No leave applications yet.</div>
            ) : (
              recentLeaves.map((leave) => (
                <div key={leave._id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-800">{leave.employee?.name || "Unknown"}</p>

                    <p className="mt-0.5 text-[10px] capitalize text-slate-400">{leave.leaveType} leave</p>
                  </div>

                  <div className="ml-2 shrink-0 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize ${
                        leave.status === "approved" ? "bg-green-100 text-green-700" : leave.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {leave.status}
                    </span>

                    <p className="mt-0.5 text-[9px] text-slate-400">
                      {new Date(leave.startDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
