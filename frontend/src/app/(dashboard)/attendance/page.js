"use client";

import { useEffect, useState } from "react";
import attendanceService from "@/services/attendanceService";
import { useEmployees } from "@/hooks/useEmployees";
import { useAttendance } from "@/hooks/useAttendance";
import PageHeader from "@/components/common/PageHeader";

const AttendancePage = () => {
  const { employees, fetchEmployees, loading: employeesLoading } = useEmployees();

  const { attendanceRecords, fetchAttendance, loading: attendanceLoading } = useAttendance();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [message, setMessage] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualStatus, setManualStatus] = useState("Present");

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      const employeeList = await fetchEmployees();

      if (employeeList?.length) {
        setSelectedEmployeeId(employeeList[0]._id);
      }
    };

    loadEmployees();
  }, [fetchEmployees]);

  // Load attendance
  useEffect(() => {
    if (!selectedEmployeeId) return;

    const loadAttendance = async () => {
      await fetchAttendance(selectedEmployeeId);
    };

    loadAttendance();
  }, [selectedEmployeeId, fetchAttendance]);

  const handleCheckIn = async () => {
    if (!selectedEmployeeId) {
      setMessage("Please select an employee");
      return;
    }

    try {
      await attendanceService.checkIn(selectedEmployeeId);

      setMessage("Check In Successful");

      await fetchAttendance(selectedEmployeeId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Check In Failed");
    }
  };

  const handleCheckOut = async () => {
    if (!selectedEmployeeId) {
      setMessage("Please select an employee");
      return;
    }

    try {
      await attendanceService.checkOut(selectedEmployeeId);

      setMessage("Check Out Successful");

      await fetchAttendance(selectedEmployeeId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Check Out Failed");
    }
  };

  const handleManualMark = async (e) => {
    e.preventDefault();

    if (!selectedEmployeeId) {
      setMessage("Please select an employee");
      return;
    }

    if (!manualDate) {
      setMessage("Please select a date");
      return;
    }

    try {
      await attendanceService.markAttendance({
        employeeId: selectedEmployeeId,
        date: manualDate,
        status: manualStatus,
      });

      setMessage("Manual Marking Successful");

      setManualDate("");
      setManualStatus("Present");

      await fetchAttendance(selectedEmployeeId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Manual Marking Failed");
    }
  };

  if (employeesLoading) {
    return <p className="p-6">Loading employees...</p>;
  }

  return (
    <div className="p-6">
      <PageHeader title="Attendance Records" subtitle="Manage employee attendance records" />

      {/* Employee Select + Actions */}
      <div className="mt-6 mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Select Employee</label>

          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="h-10 w-72 rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {employees.length === 0 ? (
              <option value="">No employees found</option>
            ) : (
              employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))
            )}
          </select>
        </div>

        <button
          type="button"
          onClick={handleCheckIn}
          disabled={!selectedEmployeeId}
          className="h-10 cursor-pointer rounded bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/10 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check In
        </button>

        <button
          type="button"
          onClick={handleCheckOut}
          disabled={!selectedEmployeeId}
          className="h-10 cursor-pointer rounded bg-slate-800 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check Out
        </button>

        {message && <p className="mb-2 ml-2 text-sm font-medium text-emerald-600">{message}</p>}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance Table */}
        <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-800">Attendance History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Check In</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Check Out</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Hours</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {attendanceLoading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">
                      Loading attendance records...
                    </td>
                  </tr>
                ) : attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">
                      No Attendance Records Found
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((record) => (
                    <tr key={record._id} className="transition-colors hover:bg-slate-50">
                      {/* Date */}
                      <td className="px-4 py-3 text-sm text-slate-700">{record.date ? new Date(record.date).toLocaleDateString("en-IN") : "—"}</td>

                      {/* Check In */}
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {record.checkIn
                          ? new Date(record.checkIn).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      {/* Check Out */}
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {record.checkOut
                          ? new Date(record.checkOut).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      {/* Work Hours */}
                      <td className="px-4 py-3 text-sm text-slate-700">{record.workHours ?? "—"}</td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            record.status === "Present" ? "bg-green-100 text-green-700" : record.status === "Absent" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="h-fit rounded-xl border border-gray-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-800">Manual Entry</h2>

            <p className="mt-1 text-sm text-slate-500">Record attendance manually.</p>
          </div>

          <form onSubmit={handleManualMark} className="space-y-5 p-5">
            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>

              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>

              <select
                value={manualStatus}
                onChange={(e) => setManualStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="On Leave">On Leave</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!selectedEmployeeId}
              className="w-full cursor-pointer rounded bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Record Attendance
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
