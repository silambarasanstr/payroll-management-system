import { useState } from "react";
import attendanceService from "@/services/attendanceService";

export const useAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async (employeeId) => {
    try {
      setLoading(true);

      const res = await attendanceService.getAttendanceRecords(employeeId);

      const attendanceList = res.data?.data || res.data || res || [];

      setAttendanceRecords(attendanceList);
      console.log("Attendance Records:", attendanceList);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    attendanceRecords,
    loading,
    fetchAttendance,
  };
};
