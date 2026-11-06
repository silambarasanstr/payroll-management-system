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
    console.log("Profile response:", response.data);
    return response.data;
  },
};

export default authService;
