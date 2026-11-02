import mongoose from "mongoose";

const salaryStructureSchema = new mongoose.Schema({
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
});

const employeeSchema = new mongoose.Schema({
  // Personal Information
  employeeId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, trim: true },

  // Employment Information
  designation: { type: String, required: true },
  department: { type: String, required: true },
  dateOfJoining: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    enum: ["active", "inactive", "terminated"],
    default: "active",
  },

  // Bank Details
  bankDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
  },
  // Salary Information
  salaryStructure: { type: salaryStructureSchema, default: {} },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
