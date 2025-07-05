import axios from "axios";

// API base URL configuration
const getApiBaseUrl = () => {
  // Check if we're in production (deployed on Netlify)
  if (window.location.hostname === "admincodeintervu.netlify.app") {
    return "https://codeintervu-backend.onrender.com";
  }

  // For development, use environment variable or fallback to localhost
  return import.meta.env.VITE_API_URL || "http://localhost:5000";
};

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
