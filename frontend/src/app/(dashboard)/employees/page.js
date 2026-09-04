"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Trash2, Mail, Phone, CalendarDays } from "lucide-react";
import employeesService from "@/services/employeesService";
import AddEmployeeModal from "@/components/common/AddEmployeeModal";
import PageHeader from "@/components/common/PageHeader";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeesService.getEmployees();
        setEmployees(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return employees;

    return employees.filter((emp) => {
      return (
        emp.name?.toLowerCase().includes(value) ||
        emp.employeeId?.toLowerCase().includes(value) ||
        emp.department?.toLowerCase().includes(value) ||
        emp.designation?.toLowerCase().includes(value) ||
        emp.email?.toLowerCase().includes(value) ||
        emp.phone?.toLowerCase().includes(value)
      );
    });
  }, [employees, search]);

  const handleDelete = async (employeeId) => {
    try {
      await employeesService.deleteEmployee(employeeId);

      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Employees" subtitle="Manage all employees in your organization" />

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Search */}
      <div className="hidden md:flex w-60 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 focus-within:border-gray-300 focus-within:bg-white">
        <div className="flex items-center gap-1 w-full">
          <Search size={18} className="shrink-0 text-emerald-600" />

          <input
            type="text"
            placeholder="Search by name, ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-1 py-2 text-xs text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Count */}
      <div className="mt-5 flex items-center justify-between sm:mt-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800 sm:text-base">
          Total Employees
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{filteredEmployees.length}</span>
        </h2>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="mt-16 flex justify-center py-10 text-sm text-slate-500">Loading Employees...</div>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="mt-5 hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] whitespace-nowrap">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    {["Employee", "Employee ID", "Department", "Designation", "Email", "Phone", "Salary", "Status", "Joined", "Actions"].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr key={employee._id} className="transition-colors hover:bg-slate-50">
                        {/* Employee */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800">{employee.name || "-"}</p>

                              <p className="text-xs text-slate-500">{employee.bankDetails?.bankName || "-"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Employee ID */}
                        <td className="px-4 py-3 text-sm text-slate-700">{employee.employeeId || "-"}</td>

                        {/* Department */}
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{employee.department || "-"}</span>
                        </td>

                        {/* Designation */}
                        <td className="px-4 py-3 text-sm text-slate-700">{employee.designation || "-"}</td>

                        {/* Email */}
                        <td className="px-4 py-3 text-sm text-slate-600">{employee.email || "-"}</td>

                        {/* Phone */}
                        <td className="px-4 py-3 text-sm text-slate-600">{employee.phone || "-"}</td>

                        {/* Salary */}
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-blue-600">₹{employee.salaryStructure?.basicSalary?.toLocaleString() || "0"}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${employee.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                            {employee.status || "inactive"}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-3 text-sm text-slate-600">{employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : "-"}</td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleDelete(employee._id)}
                            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-14 text-center">
                        <h3 className="text-sm font-semibold text-slate-700">No Employees Found</h3>

                        <p className="mt-1 text-sm text-slate-500">Try searching with a different keyword.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="mt-5 space-y-3 md:hidden">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div key={employee._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  {/* Employee Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">{employee.name?.charAt(0).toUpperCase()}</div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-800">{employee.name || "-"}</h3>

                        <p className="mt-0.5 text-xs text-slate-500">{employee.employeeId || "-"}</p>
                      </div>
                    </div>

                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${employee.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {employee.status || "inactive"}
                    </span>
                  </div>

                  {/* Department / Designation */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{employee.department || "-"}</span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{employee.designation || "-"}</span>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Mail size={14} className="shrink-0 text-slate-400" />
                      <span className="truncate">{employee.email || "-"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone size={14} className="shrink-0 text-slate-400" />
                      <span>{employee.phone || "-"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <CalendarDays size={14} className="shrink-0 text-slate-400" />
                      <span>Joined: {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : "-"}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div>
                      <p className="text-[11px] text-slate-400">Basic Salary</p>

                      <p className="text-sm font-semibold text-blue-600">₹{employee.salaryStructure?.basicSalary?.toLocaleString() || "0"}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(employee._id)}
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700">No Employees Found</h3>

                <p className="mt-1 text-sm text-slate-500">Try searching with a different keyword.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal isOpen={open} onClose={() => setOpen(false)} onAddEmployee={(employee) => setEmployees((prev) => [...prev, employee])} />
    </div>
  );
};

export default EmployeesPage;
