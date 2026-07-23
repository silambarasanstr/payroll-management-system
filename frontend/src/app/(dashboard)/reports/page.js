"use client";

import { useEffect, useState } from "react";
import { Loader2, FileText, Printer, Building2, TrendingUp, CalendarClock, DollarSign } from "lucide-react";
import employeesService from "@/services/employeesService";
import payrollService from "@/services/payrollService";
import leaveService from "@/services/leaveService";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [financials, setFinancials] = useState({
    totalSpend: 0,
    avgSalary: 0,
    maxSalary: 0,
    minSalary: 0,
  });
  const [deptStats, setDeptStats] = useState([]);
  const [leaveStats, setLeaveStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        // Fetch employees
        const emps = await employeesService.getEmployees();
        const employeesList = emps || [];

        // Fetch payrolls
        const payRes = await payrollService.getPayrolls();
        const payrollsList = payRes.data.data || [];

        // Fetch leaves
        const leaveRes = await leaveService.getEmployeeLeaves("all");
        const leavesList = leaveRes.data || [];

        // 1. Calculate financials
        if (payrollsList.length > 0) {
          const totalSpend = payrollsList.reduce((acc, curr) => acc + curr.netPay, 0);
          const salaries = payrollsList.map((p) => p.netPay);
          setFinancials({
            totalSpend,
            avgSalary: totalSpend / payrollsList.length,
            maxSalary: Math.max(...salaries),
            minSalary: Math.min(...salaries),
          });
        } else {
          // Fallback to basic salary in employee schema if no payrolls generated yet
          const totalBasic = employeesList.reduce((acc, curr) => acc + (curr.salaryStructure?.basicSalary || 0), 0);
          const salaries = employeesList.map((e) => e.salaryStructure?.basicSalary || 0).filter(Boolean);
          setFinancials({
            totalSpend: totalBasic,
            avgSalary: employeesList.length > 0 ? totalBasic / employeesList.length : 0,
            maxSalary: salaries.length > 0 ? Math.max(...salaries) : 0,
            minSalary: salaries.length > 0 ? Math.min(...salaries) : 0,
          });
        }

        // 2. Department stats
        const depts = {};
        employeesList.forEach((emp) => {
          const d = emp.department || "Other";
          const sal = emp.salaryStructure?.basicSalary || 0;
          if (!depts[d]) {
            depts[d] = { name: d, count: 0, totalSal: 0 };
          }
          depts[d].count += 1;
          depts[d].totalSal += sal;
        });
        setDeptStats(Object.values(depts));

        // 3. Leave stats
        const lApproved = leavesList.filter((l) => l.status === "approved").length;
        const lPending = leavesList.filter((l) => l.status === "pending").length;
        const lRejected = leavesList.filter((l) => l.status === "rejected").length;
        setLeaveStats({
          total: leavesList.length,
          approved: lApproved,
          pending: lPending,
          rejected: lRejected,
        });
      } catch (error) {
        console.error("Failed to load report data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
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

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <PageHeader title="Organization Reports" subtitle="Summary statistics and department metrics" />
        <button
          onClick={() => window.print()}
          className="rounded bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-600/10 cursor-pointer transition flex items-center gap-2"
        >
          <Printer size={16} />
          Print Report
        </button>
      </div>

      {/* Printed Header Banner */}
      <div className="hidden print:block border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Payroll Management System Summary Report</h1>
        <p className="text-sm text-slate-600 mt-1">Generated Date: {new Date().toLocaleDateString("en-IN")}</p>
      </div>

      {/* Cards stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial overview */}
        <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-800">Salary Spendings</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-sm text-slate-500">Total Spend:</span>
              <span className="text-sm font-bold text-slate-800">{formatCurrency(financials.totalSpend)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-sm text-slate-500">Average Salary:</span>
              <span className="text-sm font-bold text-slate-800">{formatCurrency(financials.avgSalary)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-sm text-slate-500">Highest Salary:</span>
              <span className="text-sm font-bold text-emerald-600">{formatCurrency(financials.maxSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Lowest Salary:</span>
              <span className="text-sm font-bold text-red-500">{formatCurrency(financials.minSalary)}</span>
            </div>
          </div>
        </div>

        {/* Leave metrics */}
        <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarClock size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-800">Leave Indicators</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-sm text-slate-500">Total Applications:</span>
              <span className="text-sm font-bold text-slate-800">{leaveStats.total}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-sm text-slate-500">Approved Leaves:</span>
              <span className="text-sm font-bold text-green-600">{leaveStats.approved}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-sm text-slate-500">Pending Approvals:</span>
              <span className="text-sm font-bold text-amber-600">{leaveStats.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Rejected Applications:</span>
              <span className="text-sm font-bold text-red-500">{leaveStats.rejected}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department breakdown table */}
      <div className="rounded-2xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Building2 size={16} className="text-slate-400" />
            Department Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee Count</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Basic Salary Pool</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Basic Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {deptStats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500 text-sm">
                    No Department data found.
                  </td>
                </tr>
              ) : (
                deptStats.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{dept.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{dept.count}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-semibold">{formatCurrency(dept.totalSal)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-semibold">{formatCurrency(dept.totalSal / dept.count)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
