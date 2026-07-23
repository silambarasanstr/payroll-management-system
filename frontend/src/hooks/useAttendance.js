import { useCallback, useState } from "react";
import attendanceService from "@/services/attendanceService";

export const useAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = useCallback(async (employeeId) => {
    try {
      setLoading(true);

      const res = await attendanceService.getAttendanceRecords(employeeId);
      const attendanceList = res;
      setAttendanceRecords(attendanceList);

      return attendanceList;
    } catch (error) {
      console.error("Error fetching attendance:", error);

      setAttendanceRecords([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    attendanceRecords,
    loading,
    fetchAttendance,
  };
};
