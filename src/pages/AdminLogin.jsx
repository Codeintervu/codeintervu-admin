import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      console.log(
        "Attempting login with API URL:",
        import.meta.env.VITE_API_URL
      );
      const res = await api.post("/admin/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-poppins">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">CodeIntervu</h1>
          <p className="mt-2 text-lg text-gray-600">Admin Panel Login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-sm text-center text-red-500 bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          )}
          <div className="relative">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-selective-yellow"
              required
              placeholder="Username"
            />
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-selective-yellow"
              required
              placeholder="Password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white bg-eerie-black-1 rounded-lg hover:bg-eerie-black-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-selective-yellow"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
