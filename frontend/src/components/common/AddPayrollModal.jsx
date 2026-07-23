"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import employeesService from "@/services/employeesService";
import payrollService from "@/services/payrollService";
import { Loader2 } from "lucide-react";

export default function AddPayrollModal({ isOpen, onClose, onAddPayroll }) {
  const initialForm = {
    employee: "",
    month: new Date().getMonth() + 1, // Current month (1-indexed)
    year: new Date().getFullYear(),
    salary: 0,
    bonus: 0,
    deductions: 0,
  };

  const [form, setForm] = useState(initialForm);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadEmployees = async () => {
        try {
          setFetchingEmployees(true);
          const list = await employeesService.getEmployees();
          setEmployees(list || []);
          if (list?.length > 0) {
            setForm((prev) => ({
              ...prev,
              employee: list[0]._id,
              salary: list[0].salaryStructure?.basicSalary || 0,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch employees for payroll:", error);
        } finally {
          setFetchingEmployees(false);
        }
      };
      loadEmployees();
    }
  }, [isOpen]);

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    const selectedEmp = employees.find((emp) => emp._id === empId);

    setForm((prev) => ({
      ...prev,
      employee: empId,
      salary: selectedEmp ? selectedEmp.salaryStructure?.basicSalary || 0 : 0,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "employee" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await payrollService.createPayroll(form);
      alert(response.data.message || "Payroll generated successfully.");
      onAddPayroll(response.data.data);
      setForm(initialForm);
      onClose();
    } catch (error) {
      console.error("Failed to generate payroll:", error);
      alert(error.response?.data?.message || "Failed to generate payroll. Check if payroll already exists for this month.");
    } finally {
      setLoading(false);
    }
  };

  const netPay = form.salary + form.bonus - form.deductions;

  return (
    <Modal title="Generate Salary Payroll" isOpen={isOpen} onClose={onClose} width="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {fetchingEmployees ? (
          <div className="py-8 flex justify-center items-center gap-2">
            <Loader2 className="animate-spin text-emerald-600" size={20} />
            <span className="text-sm text-slate-500">Loading employees...</span>
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-slate-100 p-4 bg-slate-50/50">
            {/* Employee select */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Select Employee</label>
              <select
                name="employee"
                value={form.employee}
                onChange={handleEmployeeChange}
                required
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Month & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Month</label>
                <select
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  required
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(2000, m - 1).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  placeholder="2026"
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Base Salary */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Basic Salary (₹)</label>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                required
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Bonus & Deductions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Bonus (₹)</label>
                <input
                  type="number"
                  name="bonus"
                  value={form.bonus}
                  onChange={handleChange}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Deductions (₹)</label>
                <input
                  type="number"
                  name="deductions"
                  value={form.deductions}
                  onChange={handleChange}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Calculated Net Pay */}
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Calculated Net Pay:</span>
              <span className="text-base font-bold text-emerald-600">₹{netPay.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 cursor-pointer">
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || fetchingEmployees}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/10 cursor-pointer transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
