import axios from "axios";

// API base URL configuration
const getApiBaseUrl = () => {
  // Check if we're in production (deployed on Netlify)
  if (
    window.location.hostname === "admincodeintervu.netlify.app" ||
    window.location.hostname.includes("netlify.app")
  ) {
    return "https://codeintervu-backend.onrender.com/api";
  }

  // Use environment variable if available (for development)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback to production URL
  return "https://codeintervu-backend.onrender.com/api";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
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
