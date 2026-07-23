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
  const [manualStatus, setManualStatus] = useState("present");

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

  if (employeesLoading) {
    return <p className="p-6">Loading employees...</p>;
  }

  const handleCheckIn = async () => {
    try {
      await attendanceService.checkIn(selectedEmployeeId);

      setMessage("Check In Successful");
      await fetchAttendance(selectedEmployeeId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Check In Failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await attendanceService.checkOut(selectedEmployeeId);

      console.log("Checkout Response:", res);
      setMessage("Check Out Successful");
      await fetchAttendance(selectedEmployeeId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Check Out Failed");
    }
  };

  const handleManualMark = async () => {
    try {
      const markAttendance = await attendanceService.markAttendance({
        employeeId: selectedEmployeeId,
        date: manualDate,
        status: manualStatus,
      });
      console.log(markAttendance);
      setMessage("Manual Marking Successful");
      // Refresh attendance list
      await fetchAttendance(selectedEmployeeId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Manual Marking Failed");
    }
  };

  return (
    <div className="p-6">
      <PageHeader title="Attendance Records" subtitle="Manage employee attendance records" />

      {/* Employee Select */}
      <div className="mt-6 flex flex-wrap items-end gap-3 mb-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Select Employee</label>

          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="w-72 h-10 rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCheckIn}
          className="h-10 text-sm px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm shadow-emerald-600/10 transition cursor-pointer"
        >
          Check In
        </button>

        <button onClick={handleCheckOut} className="h-10 text-sm px-5 py-2 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold shadow-sm transition cursor-pointer">
          Check Out
        </button>

        {message && <p className="ml-2 mb-2 text-sm font-medium text-emerald-600">{message}</p>}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Table */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-800">Attendance History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
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
                    <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-700">{new Date(record.date).toLocaleDateString("en-IN")}</td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {record.checkIn
                          ? new Date(record.checkIn).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {record.checkOut
                          ? new Date(record.checkOut).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">{record.workHours ?? "-"}</td>

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
        <div className="rounded-xl border border-gray-300 bg-white shadow-sm h-fit">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-800">Manual Entry</h2>
            <p className="text-sm text-slate-500 mt-1">Record attendance manually.</p>
          </div>

          <form onSubmit={handleManualMark} className="p-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                required
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

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

            <button type="submit" className="w-full rounded bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-sm cursor-pointer">
              Record Attendance
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
