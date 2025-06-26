import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiGrid, FiLogOut, FiSun, FiMoon } from "react-icons/fi";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleTheme = () => setIsDark(!isDark);

  const linkClasses = (isActive) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
      isActive
        ? "bg-selective-yellow text-eerie-black-1"
        : "text-gray-600 hover:bg-gray-200 hover:text-eerie-black-1"
    }`;

  return (
    <div className="w-64 bg-white h-full flex flex-col p-4 shadow-lg">
      <Link
        to="/"
        className="text-2xl font-bold font-league-spartan text-eerie-black-1 mb-10 pl-2"
      >
        Admin Panel
      </Link>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/categories"
          className={({ isActive }) => linkClasses(isActive)}
        >
          <FiGrid />
          <span>Categories</span>
        </NavLink>
      </nav>

      <div className="mt-auto">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-eerie-black-1 font-semibold"
        >
          {isDark ? <FiSun /> : <FiMoon />}
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 font-semibold mt-2"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
