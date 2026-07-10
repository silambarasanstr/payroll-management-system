import api from "@/lib/axios";

const attendanceService = {
  getAttendanceRecords: async (employeeId) => {
    const response = await api.get(`/attendance/${employeeId}`);
    return response.data.data; // returns attendance array
  },
};

export default attendanceService;