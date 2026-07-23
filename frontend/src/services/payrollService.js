import api from "@/lib/axios";

const payrollService = {
  getPayrolls: () => api.get("/payrolls"),
  createPayroll: (data) => api.post("/payrolls", data),
  updatePayroll: (id, data) => api.put(`/payrolls/${id}`, data),
  deletePayroll: (id) => api.delete(`/payrolls/${id}`),
};

export default payrollService;
