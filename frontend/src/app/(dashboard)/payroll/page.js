"use client";

import { useEffect, useState } from "react";
import payrollService from "@/services/payrollService";
import { Wallet, BadgeDollarSign, Building2, Loader2, Plus, Trash2 } from "lucide-react";
import AddPayrollModal from "@/components/common/AddPayrollModal";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await payrollService.getPayrolls();
      setPayrolls(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleDelete = async (payrollId) => {
    if (!confirm("Are you sure you want to delete this payroll record?")) return;
    try {
      setDeletingId(payrollId);
      await payrollService.deletePayroll(payrollId);
      setPayrolls((prev) => prev.filter((p) => p._id !== payrollId));
      alert("Payroll deleted successfully.");
    } catch (error) {
      console.error("Failed to delete payroll:", error);
      alert("Failed to delete payroll record.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddPayrollSuccess = (newPayroll) => {
    // Refresh list from backend to make sure populate works correctly
    fetchPayrolls();
  };

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
      <div className="flex justify-between items-center">
        <PageHeader title="Employees" subtitle="Manage employee records" />

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-4 py-2 text-sm font-semibold">Total Payrolls: {payrolls.length}</div>

          <button
            onClick={() => setModalOpen(true)}
            className="rounded bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-600/10 cursor-pointer transition flex items-center gap-2"
          >
            <Plus size={16} />
            Generate Payroll
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-white border border-gray-300 shadow-sm">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Employee</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Department</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Salary</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Bonus</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Deduction</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Net Pay</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Month</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {payrolls.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-500 text-sm">
                  No Payroll Records Found
                </td>
              </tr>
            ) : (
              payrolls.map((payroll) => (
                <tr key={payroll._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{payroll.employee?.name || "Unknown"}</div>
                    <div className="text-xs text-slate-500">{payroll.employee?.employeeId || "-"}</div>
                    <div className="text-xs text-slate-400">{payroll.employee?.designation || "-"}</div>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Building2 size={15} className="text-slate-400" />
                      {payroll.employee?.department || "-"}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">{formatCurrency(payroll.salary)}</td>

                  <td className="text-green-600 px-4 py-3 text-sm font-medium">+ {formatCurrency(payroll.bonus)}</td>

                  <td className="text-red-600 px-4 py-3 text-sm font-medium">- {formatCurrency(payroll.deductions)}</td>

                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                      <Wallet size={14} />
                      <span className="font-bold text-sm">{formatCurrency(payroll.netPay)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="inline-flex items-center gap-2">
                      <BadgeDollarSign size={15} className="text-slate-400" />
                      {new Date(payroll.year, payroll.month - 1).toLocaleString("default", {
                        month: "long",
                      })}{" "}
                      {payroll.year}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(payroll._id)}
                      disabled={deletingId === payroll._id}
                      title="Delete Payroll Record"
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddPayrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAddPayroll={handleAddPayrollSuccess} />
    </div>
  );
}
