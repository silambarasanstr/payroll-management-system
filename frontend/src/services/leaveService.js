import api from "@/lib/axios";

const leaveService = {
  getEmployeeLeaves: (employeeId) => api.get(`/leaves/employee/${employeeId}`),
};

export default leaveService;
