import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://payroll-management-system-0d32.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
