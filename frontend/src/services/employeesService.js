import api from "@/lib/axios";

const employeesService = {
  getEmployees: () => api.get("/employees"),
  getEmployee: (id) => api.get(`/employees/${id}`),
  createEmployee: (employee) => api.post("/employees", employee),
  updateEmployee: (id, employee) => api.put(`/employees/${id}`, employee),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
};

export default employeesService;
