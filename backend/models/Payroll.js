import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    bonus: {
      type: Number,
      default: 0,
    },

    deductions: {
      type: Number,
      default: 0,
    },

    netPay: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One payroll per employee per month/year
payrollSchema.index(
  { employee: 1, month: 1, year: 1 },
  { unique: true }
);

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll;