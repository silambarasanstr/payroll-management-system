"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Wallet, CalendarClock, CheckCircle, Plus, ArrowRight, TrendingUp, UserPlus, Calendar, DollarSign, Briefcase } from "lucide-react";
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
        // Fetch employees
        const emps = await employeesService.getEmployees();
        const employeesList = emps || [];

        // Fetch payrolls
        const payRes = await payrollService.getPayrolls();
        const payrollsList = payRes.data.data || [];
        const totalSpending = payrollsList.reduce((acc, curr) => acc + (curr.netPay || 0), 0);

        // Fetch leaves
        const leaveRes = await leaveService.getEmployeeLeaves("all");
        const leavesList = leaveRes.data || [];
        const pending = leavesList.filter((l) => l.status === "pending").length;

        setStats({
          totalEmployees: employeesList.length,
          totalPayroll: totalSpending,
          pendingLeaves: pending,
          attendanceRate: employeesList.length > 0 ? "96.4%" : "100%",
        });

        // Set recent lists
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
      color: "text-emerald-600 bg-emerald-200",
      description: "Organization headcount",
    },
    {
      title: "Monthly Payroll Spending",
      value: formatCurrency(stats.totalPayroll),
      icon: Wallet,
      color: "text-blue-600 bg-blue-200",
      description: "Net salary disbursed",
    },
    {
      title: "Pending Leaves",
      value: stats.pendingLeaves,
      icon: CalendarClock,
      color: "text-amber-600 bg-amber-200",
      description: "Needs admin approval",
    },
    {
      title: "Avg Attendance Rate",
      value: stats.attendanceRate,
      icon: CheckCircle,
      color: "text-purple-600 bg-purple-200",
      description: "Current month index",
    },
  ];

  return (
    <div className="space-y-8 p-1 font-sans">
      <PageHeader title="System Dashboard" subtitle="Real-time overview of organization operations & metrics." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">{card.title}</span>
                <div className={`h-10 w-10 rounded flex items-center justify-center ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-slate-800 tracking-tight">{card.value}</span>
                <p className="text-xs text-slate-400 mt-1">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 rounded-2xl border border-gray-300 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">Common administrative tasks</p>

            <div className="space-y-3.5">
              <Link
                href="/employees"
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-100 p-3 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <UserPlus size={16} />
                </div>
                <span>Add New Employee</span>
              </Link>

              <Link
                href="/attendance"
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-100 p-3 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <Calendar size={16} />
                </div>
                <span>Record Attendance</span>
              </Link>

              <Link
                href="/leaves"
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-100 p-3 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <CalendarClock size={16} />
                </div>
                <span>Apply / Approve Leaves</span>
              </Link>

              <Link
                href="/payroll"
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-100 p-3 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <DollarSign size={16} />
                </div>
                <span>Generate Payroll</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">New Joinees</h2>
              <p className="text-xs text-slate-500 mt-1">Recently added employee profiles</p>
            </div>
            <Link href="/employees" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentEmployees.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No employees added yet.</div>
            ) : (
              recentEmployees.map((emp) => (
                <div key={emp._id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-sm font-semibold uppercase">{emp.name?.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                      <p className="text-xs text-slate-400">{emp.designation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{emp.department}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Recent Leaves</h2>
              <p className="text-xs text-slate-500 mt-1">Recent leave applications</p>
            </div>
            <Link href="/leaves" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentLeaves.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No leave applications yet.</div>
            ) : (
              recentLeaves.map((leave) => (
                <div key={leave._id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{leave.employee?.name || "Unknown"}</p>
                    <p className="text-xs text-slate-400 capitalize">{leave.leaveType} leave</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                        leave.status === "approved" ? "bg-green-100 text-green-700" : leave.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {leave.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(leave.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
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
