import api from "@/lib/axios";

const employeesService = {
  // getEmployees: () => api.get("/employees"),
  getEmployees: async () => {
    const response = await api.get("/employees");
    return response.data.data;
  },
  getEmployee: (id) => api.get(`/employees/${id}`),
  createEmployee: (employee) => api.post("/employees", employee),
  updateEmployee: (id, employee) => api.put(`/employees/${id}`, employee),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
};

export default employeesService;
