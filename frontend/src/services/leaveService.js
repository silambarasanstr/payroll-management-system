import api from "@/lib/axios";

const leaveService = {
  getEmployeeLeaves: async (employeeId) => {
    const response = await api.get(`/leaves/employee/${employeeId}`);
    return response.data;
  },

  applyLeave: async (leaveData) => {
    console.log("applyLeave");
    const response = await api.post("/leaves/apply", leaveData);
    console.log(response.data.data);
    return response.data.data;
  },

  updateLeaveStatus: async (leaveId, status, remarks) => {
    const response = await api.put(`/leaves/status/${leaveId}`, { status, remarks });
    return response.data;
  },
};

export default leaveService;
