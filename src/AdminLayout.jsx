import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="bg-isabelline min-h-screen font-poppins">
      <AdminNavbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
