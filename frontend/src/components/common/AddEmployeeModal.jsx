"use client";

import { useState } from "react";
import Modal from "./Modal";
import employeesService from "@/services/employeesService";

const initialForm = {
  employeeId: "",
  name: "",
  email: "",
  phone: "",
  designation: "",
  department: "",
  dateOfJoining: "",
  
  salaryStructure: {
    basicSalary: "",
    allowances: "",
    deductions: "",
  },
};

export default function AddEmployeeModal({ isOpen, onClose, onAddEmployee }) {
  const [formData, setFormData] = useState(initialForm);
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      salaryStructure: {
        ...prev.salaryStructure,
        [name]: Number(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      setLoading(true);

      const res = await employeesService.createEmployee(formData);

console.log(res.data,"kkkkk");
      
      onAddEmployee(res.data.data);
      setFormData(initialForm);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
  const id = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  setFormData({
    ...initialForm,
    employeeId: `EMP-${id}`,
    name: "John Doe",
    email: `john${random}@example.com`,
    phone: "+1234567890",
    designation: "Software Engineer",
    department: "Engineering",
    dateOfJoining: new Date().toISOString().split("T")[0],
    salaryStructure: {
      basicSalary: 50000,
      allowances: 10000,
      deductions: 5000,
    },
  });
};

  return (
    <Modal title="Add Employee" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Employee Details */}
        <div className="rounded-md border border-gray-200 p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Employee Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="rounded-md border border-gray-200 p-3">
          <h3 className="mb-2 text-sm font-semibold">Salary Structure</h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Basic Salary</label>
              <input
                type="number"
                name="basicSalary"
                value={formData.salaryStructure.basicSalary}
                onChange={handleSalaryChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Allowances</label>
              <input
                type="number"
                name="allowances"
                value={formData.salaryStructure.allowances}
                onChange={handleSalaryChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Deductions</label>
              <input
                type="number"
                name="deductions"
                value={formData.salaryStructure.deductions}
                onChange={handleSalaryChange}
                className="h-8 w-full rounded border border-gray-300 px-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border border-gray-300 px-3 py-1.5 text-sm">
            Cancel
          </button>

           <button type="button"  onClick={handleQuickFill} className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white ">
            quick fill
           </button>

          <button type="submit" disabled={loading} className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white disabled:opacity-50">
            {loading ? "Saving..." : "Save Employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
