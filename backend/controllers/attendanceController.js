import Attendance from "../models/Attendance.js";

export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const attendanceDate = new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for the same employee and date
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Employee has already checked in for this date.",
      });
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date: attendanceDate,
      checkIn: new Date(),
      status: "present",
    });

    res.status(201).json({
      success: true,
      data: attendance,
      message: "Check-in recorded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error recording check-in",
      error: error.message,
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // Today's date
    const attendanceDate = new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // Find today's attendance
    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: attendanceDate,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Check-in record not found for today",
      });
    }

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

    attendance.checkOut = checkOutTime;
    attendance.workHours = Number(workHours.toFixed(2));

    await attendance.save();

    res.status(200).json({
      success: true,
      data: attendance,
      message: "Check-out recorded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error recording check-out",
      error: error.message,
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, remarks } = req.body;


    // Today's date
    const attendanceDate = new Date();
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
