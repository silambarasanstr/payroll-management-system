import Attendance from "../models/Attendance.js";

export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Validate employeeId
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // Today's date (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Employee has already checked in today",
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkIn: new Date(),
      status: "present",
    });

    return res.status(201).json({
      success: true,
      data: attendance,
      message: "Check-in recorded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error recording check-in",
      error: error.message,
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Validate employeeId
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // Today's date (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance
    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Check-in record not found for today",
      });
    }

    // Check if employee has checked in
    if (!attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Check-in time not found",
      });
    }

    // Check if already checked out
    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Employee has already checked out today",
      });
    }

    const checkOutTime = new Date();

    // Calculate work hours
    const workHours =
      (checkOutTime.getTime() - attendance.checkIn.getTime()) /
      (1000 * 60 * 60);

    // Update attendance
    attendance.checkOut = checkOutTime;
    attendance.workHours = Number(workHours.toFixed(2));

    await attendance.save();

    return res.status(200).json({
      success: true,
      data: attendance,
      message: "Check-out recorded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error recording check-out",
      error: error.message,
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, remarks } = req.body;


    // Today's date or custom date
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);


    const attendance = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: attendanceDate },
      { status, remarks },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(201).json({
      success: true,
      data: attendance,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking attendance",
      error,
    });
  }
};

export const getAttendance = async (req, res) => {
  console.log("Getting attendance record");
  console.log(req.params);
  try {
    const { employeeId } = req.params;

    const attendance = await Attendance.find({
      employee: employeeId,
    }).sort({ date: -1 });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }
    res.status(200).json({
      success: true,
      data: attendance,
      message: "Attendance record retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving attendance record",
      error,
    });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
      const { employeeId } = req.params;
    const { month, year } = req.query;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json({
      success: true,
      data: attendanceRecords,
      message: "Monthly summary retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving monthly summary",
      error,
    });
  }
};
