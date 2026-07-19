import api from "@/lib/axios";

const payrollService = {
  getPayrolls: () => api.get("/payrolls"),
};

export default payrollService;
