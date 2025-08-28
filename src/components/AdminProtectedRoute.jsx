import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Proactively check token expiry to avoid immediate 401 flashes
  try {
    const [, payloadBase64] = token.split(".");
    if (payloadBase64) {
      const payloadJson = JSON.parse(atob(payloadBase64));
      const expSeconds = payloadJson?.exp;
      if (expSeconds && Date.now() / 1000 >= expSeconds) {
        localStorage.removeItem("adminToken");
        return <Navigate to="/login" replace />;
      }
    }
  } catch (_) {
    // If token is malformed, force re-login
    localStorage.removeItem("adminToken");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
