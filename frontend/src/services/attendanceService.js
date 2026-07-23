import api from "@/lib/axios";

const attendanceService = {
  // Get Attendance
  getAttendanceRecords: async (employeeId) => {
    const response = await api.get(`/attendance/${employeeId}`);
    return response.data.data;
  },

  // Check In
  checkIn: async (employeeId) => {
    console.log("Checking In...");

    const response = await api.post("/attendance/check-in", {
      employeeId,
    });

    return response.data.data;
  },

  // Check Out
  checkOut: async (employeeId) => {
    console.log("Checking Out...");

    const response = await api.post("/attendance/check-out", {
      employeeId,
    });

    console.log(response.data.data);

    return response.data.data;
  },

  // Manual Attendance
  markAttendance: async (payload) => {
    const response = await api.post("/attendance/mark", payload);

    return response.data.data;
  },
};

export default attendanceService;
