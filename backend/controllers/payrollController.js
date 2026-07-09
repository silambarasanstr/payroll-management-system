import Payroll from "../models/Payroll.js";

// Create Payroll
export const createPayroll = async (req, res) => {
  try {
    const {
      employee,
      month,
      year,
      salary,
      bonus = 0,
      deductions = 0,
    } = req.body;

    const existingPayroll = await Payroll.findOne({
      employee,
      month,
      year,
    });

    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        message: "Payroll already exists for this month.",
      });
    }

    const netPay = salary + bonus - deductions;

    const payroll = await Payroll.create({
      employee,
      month,
      year,
      salary,
      bonus,
      deductions,
      netPay,
    });

    res.status(201).json({
      success: true,
      message: "Payroll created successfully.",
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Payrolls
export const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate(
      "employee",
      "name email employeeId department designation"
    );

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Payroll By ID
export const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate("employee");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Payroll
export const updatePayroll = async (req, res) => {
  try {
    const { salary, bonus = 0, deductions = 0 } = req.body;

    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found.",
      });
    }

    payroll.salary = salary;
    payroll.bonus = bonus;
    payroll.deductions = deductions;
    payroll.netPay = salary + bonus - deductions;

    await payroll.save();

    res.status(200).json({
      success: true,
      message: "Payroll updated successfully.",
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Payroll
export const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found.",
      });
    }

    await payroll.deleteOne();

    res.status(200).json({
      success: true,
      message: "Payroll deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};