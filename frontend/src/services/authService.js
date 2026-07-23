import api from "@/lib/axios";

const authService = {

  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

   register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },


  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data.data;
  },
};

export default authService;