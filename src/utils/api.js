import axios from "axios";

// Backend URL configuration
const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  "https://codeintervu-backend.onrender.com/api";

const baseURL = (() => {
  const trimmed = (rawBaseURL || "").replace(/\/+$/, "");
  if (!trimmed) return "/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
})();

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
      // Unauthorized - clear token and gently redirect after notifying
      try {
        localStorage.removeItem("adminToken");
      } catch {}
      if (window.location.pathname !== "/login") {
        // Give the UI a moment to show the error state before redirecting
        setTimeout(() => {
          window.location.href = "/login";
        }, 3300);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
