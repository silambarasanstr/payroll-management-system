import mongoose from "mongoose";

const salaryStructureSchema = new mongoose.Schema({
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
});

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, trim: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  dateOfJoining: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    enum: ["active", "inactive", "terminated"],
    default: "active",
  },
  bankDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
  },
  salaryStructure: { type: salaryStructureSchema, default: {} },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
