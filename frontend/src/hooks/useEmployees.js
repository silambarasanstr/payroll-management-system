import { useState } from "react";
import employeesService from "@/services/employeesService";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await employeesService.getEmployees();

      const employeeList = res.data?.data || res.data || [];

      setEmployees(employeeList);

      return employeeList;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    loading,
    fetchEmployees,
  };
};
