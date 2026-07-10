"use client";

import { useEffect, useState } from "react";
import attendanceService from "@/services/attendanceService";
import employeesService from "@/services/employeesService";

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeesService.getEmployees();

        const employeeList = res.data?.data || res.data || [];

        setEmployees(employeeList);

        if (employeeList.length > 0) {
          setSelectedEmployeeId(employeeList[0]._id);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch Attendance whenever employee changes
  useEffect(() => {
    if (!selectedEmployeeId) return;

    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const res = await attendanceService.getAttendanceRecords(
          selectedEmployeeId
        );

        const records = res || res.data || [];
        console.log("Records:", records);

        setAttendanceRecords(records);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedEmployeeId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Records</h1>

      {/* Employee Select */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Employee
        </label>

        <select
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          className="border rounded-md px-3 py-2 w-72"
        >
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.employeeId})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : attendanceRecords.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Check In
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Check Out
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Hours
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((record) => (
                <tr
                  key={record._id}
                  className="hover:bg-slate-50 text-slate-600"
                >
                  <td className="px-4 py-3">
                    {new Date(record.date).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-4 py-3">
                    {record.checkIn
                      ? new Date(record.checkIn).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    {record.checkOut
                      ? new Date(record.checkOut).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    {record.workHours ?? "-"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : record.status === "Absent"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;