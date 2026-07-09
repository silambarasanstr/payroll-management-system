"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import employeesService from "@/services/employeesService";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await employeesService.getEmployees();
      setEmployees(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    const value = search.toLowerCase();

    return employees.filter((emp) => {
      return (
        emp.name?.toLowerCase().includes(value) ||
        emp.employeeId?.toLowerCase().includes(value) ||
        emp.department?.toLowerCase().includes(value) ||
        emp.designation?.toLowerCase().includes(value) ||
        emp.email?.toLowerCase().includes(value)
      );
    });
  }, [employees, search]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Employees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all employees in your organization
          </p>
        </div>

        <button className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium flex items-center gap-2 shadow-sm transition">
          <Plus size={18} />
          Add Employee
        </button>

      </div>

      {/* Search */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
  <div className="flex items-center gap-3">
    <Search size={18} className="text-emerald-600" />

    <input
      type="text"
      placeholder="Search by name, ID, department..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
    />
  </div>
</div>

      {/* Count */}
   <div className="mt-6">
  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
    Total Employees

    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      {filteredEmployees.length}
    </span>
  </h2>
</div>

      {/* Table */}

      {loading ? (
        <div className="mt-20 text-center text-slate-500">
          Loading Employees...
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">

          <table className="min-w-full">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Employee
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Employee ID
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Department
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Designation
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Email
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Phone
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Salary
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Joined
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">
{filteredEmployees.length > 0 ? (
  filteredEmployees.map((employee) => (
    <tr
      key={employee._id}
      className="hover:bg-slate-50 transition-colors"
    >
      {/* Employee */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">

        <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
  {employee.name?.charAt(0).toUpperCase()}
</div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {employee.name}
            </p>

            <p className="text-xs text-slate-500">
              {employee.bankDetails?.bankName || "-"}
            </p>
          </div>

        </div>
      </td>

      {/* Employee ID */}
      <td className="px-4 py-3">
        <span className="text-sm text-slate-700">
          {employee.employeeId}
        </span>
      </td>

      {/* Department */}
      <td className="px-4 py-3">
  <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
    {employee.department}
  </span>
</td>

      {/* Designation */}
      <td className="px-4 py-3 text-sm text-slate-700">
        {employee.designation}
      </td>

      {/* Email */}
      <td className="px-4 py-3 text-sm text-slate-600">
        {employee.email}
      </td>

      {/* Phone */}
      <td className="px-4 py-3 text-sm text-slate-600">
        {employee.phone}
      </td>

      {/* Salary */}
      <td className="px-4 py-3">
        <span className="font-semibold text-blue-600 text-sm">
          ₹
          {employee.salaryStructure?.basicSalary?.toLocaleString() ||
            "0"}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            employee.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {employee.status}
        </span>
      </td>

      {/* Joining Date */}
      <td className="px-4 py-3 text-sm text-slate-600">
        {employee.dateOfJoining
          ? new Date(employee.dateOfJoining).toLocaleDateString()
          : "-"}
      </td>
    </tr>
  ))
) : (
                  <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <h3 className="text-base font-semibold text-slate-700">
                        No Employees Found
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Try searching with a different keyword.
                      </p>

                    </div>
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default EmployeesPage;

          