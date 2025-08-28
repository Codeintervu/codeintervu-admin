import axios from "axios";

// Direct backend URL configuration
const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://codeintervu-backend.onrender.com/api";

const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Admin API Error:", error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
