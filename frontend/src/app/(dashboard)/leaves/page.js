"use client";

import { useEffect, useState } from "react";
import leaveService from "@/services/leaveService";
import { Calendar, Search, FileText, Loader2 } from "lucide-react";

const employeeId = "6a4ec34b279c56b78daf5166";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await leaveService.getEmployeeLeaves(employeeId);

      setLeaves(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

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
          <h1 className="text-2xl font-bold text-slate-800">Leaves</h1>

          <p className="text-slate-500 text-sm">View employee leave history</p>
        </div>

        <div className="bg-blue-600 text-white px-5 py-2 rounded-lg">Total Leaves : {leaves.length}</div>
      </div>

      {/* Search */}

      {/* Table */}

      <div className="mt-5 overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-sm text-slate-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Employee</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Leave Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reason</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Remarks</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 ">
            {leaves.length === 0 ? (
              <tr className="hover:bg-slate-50 transition-colors">
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No Leave Records Found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{leave.employee?.name}</div>

                    <div className="text-xs text-gray-500">{leave.employee?.email}</div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="capitalize">{leave.leaveType}</span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={15} />

                      <div>
                        <div>{formatDate(leave.startDate)}</div>
                        <div className="text-gray-500">to {formatDate(leave.endDate)}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex gap-2">
                      <FileText size={15} className="mt-1" />

                      <span>{leave.reason}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(leave.status)}`}>{leave.status}</span>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">{leave.remarks || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
