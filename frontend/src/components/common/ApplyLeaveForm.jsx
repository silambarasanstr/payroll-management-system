import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import employeesService from "@/services/employeesService";
import leaveService from "@/services/leaveService";

const ApplyLeaveForm = ({ isOpen, onClose,onSuccess  }) => {
  const initialForm = {
    employeeId: "",
    leaveType: "casual",
    startDate: "",
    endDate: "",
    reason: "",
  };

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const data = await employeesService.getEmployees();

      const employeeList = data?.data || data || [];

      setEmployees(employeeList);
     

      if (employeeList.length > 0) {
        setForm((prev) => ({
          ...prev,
          employeeId: employeeList[0]._id,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await leaveService.applyLeave(form);

      alert("Leave applied successfully.");

      setForm({
        ...initialForm,
        employeeId: employees.length ? employees[0]._id : "", 
      });

      if (onSuccess) {
      await onSuccess();
    }
 
      onClose();
    } catch (error) {
      console.error("Failed to apply leave", error);
      alert(error.response?.data?.message || "Failed to apply leave.");
    }
  };

  return (
    <Modal title="Apply for Leave" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-3 rounded-md border border-gray-200 p-3">
          {/* Employee & Leave Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Employee
              </label>

              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">Select Employee</option>

                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">
                Leave Type
              </label>

              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              >
                <option value="casual">Casual</option>
                <option value="sick">Sick</option>
                <option value="earned">Earned</option>
                <option value="unpaid">Unpaid</option>
                <option value="maternity">Maternity</option>
                <option value="paternity">Paternity</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-1 block text-xs font-medium">
              Reason
            </label>

            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
          >
            Apply Leave
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyLeaveForm;