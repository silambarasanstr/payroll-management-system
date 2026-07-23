"use client";

import { useEffect, useState } from "react";
import { Calendar, FileText, Check, X, Loader2 } from "lucide-react";

import authService from "@/services/authService";
import leaveService from "@/services/leaveService";

import ApplyLeaveForm from "@/components/common/ApplyLeaveForm";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [remarksInputs, setRemarksInputs] = useState({});

  const fetchLeaves = async () => {
    setLoading(true);

    try {
      // Logged-in user profile
      const profile = await authService.getProfile();
      setUserProfile(profile);

      // If admin/hr, fetch all leaves. Otherwise fetch only employee's leaves.
      const isAdmin = profile.role === "admin" || profile.role === "hr";
      const targetId = isAdmin ? "all" : profile.employee;

      if (targetId) {
        const response = await leaveService.getEmployeeLeaves(targetId);
        setLeaves(response.data || []);
      } else {
        setLeaves([]);
      }
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleLeaveSuccess = async () => {
    await fetchLeaves();
    setModalOpen(false);
  };

  const handleUpdateStatus = async (leaveId, status) => {
    setActionLoading(leaveId);
    try {
      const remarks = remarksInputs[leaveId] || "";
      await leaveService.updateLeaveStatus(leaveId, status, remarks);
      alert(`Leave ${status} successfully.`);
      await fetchLeaves();
    } catch (error) {
      console.error("Failed to update leave status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemarksChange = (leaveId, val) => {
    setRemarksInputs((prev) => ({
      ...prev,
      [leaveId]: val,
    }));
  };

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
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

  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "hr";

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leaves</h1>
          <p className="text-sm text-slate-500">
            {isAdmin ? "Manage all organization leave requests" : "View and apply for your leave history"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded bg-emerald-50  px-4 py-2 text-sm font-semibold text-emerald-700 border border-emerald-200">
            Total Requests: {leaves.length}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="rounded bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-600/10 cursor-pointer transition"
          >
            + Apply for Leave
          </button>
        </div>
      </div>

      {/* Leave Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-left text-sm text-slate-700">
              <th className="px-4 py-3 font-semibold">Employee</th>
              <th className="px-4 py-3 font-semibold">Leave Type</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Days</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Remarks</th>
              {isAdmin && <th className="px-4 py-3 font-semibold text-center">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="py-10 text-center text-slate-500">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin text-emerald-600" size={20} />
                    <span>Loading leave records...</span>
                  </div>
                </td>
              </tr>
            ) : leaves.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="py-10 text-center text-slate-500">
                  No Leave Records Found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">
                      {leave.employee?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {leave.employee?.email || "-"}
                    </div>
                  </td>

                  <td className="px-4 py-3 capitalize text-sm text-slate-700">
                    {leave.leaveType}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Calendar size={15} className="text-slate-400" />

                      <div>
                        <div>{formatDate(leave.startDate)}</div>
                        <div className="text-slate-400 text-xs">
                          to {formatDate(leave.endDate)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">{leave.totalDays}</td>

                  <td className="px-4 py-3 max-w-xs text-sm text-slate-600">
                    <div className="flex gap-2">
                      <FileText size={15} className="mt-1 text-slate-400 flex-shrink-0" />
                      <span>{leave.reason}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {leave.status === "pending" && isAdmin ? (
                      <input
                        type="text"
                        placeholder="Add optional remarks..."
                        value={remarksInputs[leave._id] || ""}
                        onChange={(e) => handleRemarksChange(leave._id, e.target.value)}
                        className="rounded border border-slate-200 px-2.5 py-1 text-xs outline-none focus:border-emerald-500 w-full max-w-[150px]"
                      />
                    ) : (
                      leave.remarks || "-"
                    )}
                  </td>

                  {isAdmin && (
                    <td className="px-4 py-3 text-center">
                      {leave.status === "pending" ? (
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(leave._id, "approved")}
                            disabled={actionLoading === leave._id}
                            title="Approve"
                            className="p-1.5 rounded-lg bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 transition cursor-pointer"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(leave._id, "rejected")}
                            disabled={actionLoading === leave._id}
                            title="Reject"
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Decided</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ApplyLeaveForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleLeaveSuccess}
      />
    </div>
  );
}