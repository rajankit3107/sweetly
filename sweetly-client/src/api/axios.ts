import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
