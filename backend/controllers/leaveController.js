import Leave from "../models/Leave.js";

export const applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    const leave = new Leave({
      employee: employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await leave.save();

    res.status(201).json({
      success: true,
      data: leave,
      message: "Leave application submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error applying for leave",
      error,
    });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const { status, employeeId } = req.query;

    const filter = {};

    if (employeeId) {
      filter.employee = employeeId;
    }

    if (status) {
      filter.status = status;
    }

    const leaves = await Leave.find(filter).populate("employee", "name email");

    res.status(200).json({
      success: true,
      data: leaves,
      message: "Leave records retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving leave records",
      error,
    });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave record not found",
      });
    }

    leave.status = status;
    leave.remarks = remarks;

    await leave.save();

    res.status(200).json({
      success: true,
      data: leave,
      message: "Leave status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating leave status",
      error,
    });
  }
};
