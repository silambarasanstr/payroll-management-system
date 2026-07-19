"use client";

import { useEffect, useMemo, useState } from "react";
import payrollService from "@/services/payrollService";
import { Search, Wallet, BadgeDollarSign, Building2, Loader2 } from "lucide-react";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payroll Management</h1>

          <p className="text-sm text-slate-500">Employee Salary Details</p>
        </div>

        <div className="bg-blue-600 text-white rounded-lg px-5 py-2 font-medium">Total Payrolls : {payrolls.length}</div>
      </div>

      {/* Table */}

      <div className="mt-5 overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
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
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 ">
            {payrolls.length === 0 ? (
              <tr className="hover:bg-slate-50 transition-colors">
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  No Payroll Records Found
                </td>
              </tr>
            ) : (
              payrolls.map((payroll) => (
                <tr key={payroll._id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{payroll.employee?.name}</div>

                    <div className="text-xs text-gray-500">{payroll.employee?.employeeId}</div>

                    <div className="text-xs text-gray-400">{payroll.employee?.designation}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 size={15} />

                      {payroll.employee?.department}
                    </div>
                  </td>

                  <td className="px-4 py-3">{formatCurrency(payroll.salary)}</td>

                  <td className="text-green-600 px-4 py-3">+ {formatCurrency(payroll.bonus)}</td>

                  <td className="text-red-600 px-4 py-3">- {formatCurrency(payroll.deductions)}</td>

                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <Wallet size={15} />

                      <span className="font-semibold">{formatCurrency(payroll.netPay)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2">
                      <BadgeDollarSign size={15} />
                      {new Date(payroll.year, payroll.month - 1).toLocaleString("default", {
                        month: "long",
                      })}{" "}
                      {payroll.year}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
