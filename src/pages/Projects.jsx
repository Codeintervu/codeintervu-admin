import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../utils/api";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiExternalLink,
  FiFilter,
  FiSearch,
  FiGrid,
  FiList,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    withTopmate: 0,
    withoutTopmate: 0,
  });

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Java Spring Boot", value: "springboot" },
    { label: "Machine Learning", value: "ml" },
    { label: "Deep Learning", value: "dl" },
    { label: "Gen AI", value: "genai" },
    { label: "MERN", value: "mern" },
  ];

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/projects/admin");
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/projects/admin/stats");
      setStats(response.data.data || {
        total: 0,
        active: 0,
        withTopmate: 0,
        withoutTopmate: 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === "all" || project.key.includes(filter);
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setLoading(true);
        await api.delete(`/projects/admin/${id}`);
        
        // Refresh projects and stats
        await fetchProjects();
        await fetchStats();
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      await api.patch(`/projects/admin/${id}/toggle-status`);
      
      // Refresh projects and stats
      await fetchProjects();
      await fetchStats();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to toggle project status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="p-8">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-96"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded w-40"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-300 rounded w-24"></div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 bg-gray-300 rounded w-64"></div>
                <div className="h-10 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>

          {/* Projects Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-300 rounded flex-1"></div>
                    <div className="h-8 bg-gray-300 rounded flex-1"></div>
                    <div className="h-8 bg-gray-300 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Projects Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your project offerings and Topmate links
            </p>
          </div>
          <Link
            to="/projects/add"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <FiPlus /> Add New Project
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === option.value
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {/* Search and View Mode */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                />
              </div>
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FiSearch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first project"}
            </p>
            {!searchTerm && filter === "all" && (
              <Link
                to="/projects/add"
                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 font-medium"
              >
                Add Your First Project
              </Link>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                  !project.isActive ? "opacity-60" : ""
                }`}
              >
                {/* Project Image */}
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(project._id)}
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        project.isActive
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {project.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4">
                    <span className="text-gray-400 line-through text-sm">
                      ₹{project.realPrice}
                    </span>
                    <span className="text-green-600 font-bold text-lg ml-2">
                      ₹{project.offerPrice}
                    </span>
                  </div>

                  {/* Topmate Link Status */}
                  <div className="mb-4">
                    {project.topmateLink ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <FiExternalLink />
                        <span>Topmate link configured</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-600 text-sm">
                        <FiExternalLink />
                        <span>No Topmate link</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/projects/${project._id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                    >
                      <FiEye className="inline mr-1" />
                      View
                    </Link>
                    <Link
                      to={`/projects/${project._id}/edit`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                    >
                      <FiEdit className="inline mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      <FiTrash2 className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

                       {/* Stats */}
               <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="bg-white rounded-lg shadow p-6">
                   <div className="text-2xl font-bold text-gray-900">
                     {stats.total}
                   </div>
                   <div className="text-gray-600">Total Projects</div>
                 </div>
                 <div className="bg-white rounded-lg shadow p-6">
                   <div className="text-2xl font-bold text-green-600">
                     {stats.active}
                   </div>
                   <div className="text-gray-600">Active Projects</div>
                 </div>
                 <div className="bg-white rounded-lg shadow p-6">
                   <div className="text-2xl font-bold text-blue-600">
                     {stats.withTopmate}
                   </div>
                   <div className="text-gray-600">With Topmate Links</div>
                 </div>
                 <div className="bg-white rounded-lg shadow p-6">
                   <div className="text-2xl font-bold text-orange-600">
                     {stats.withoutTopmate}
                   </div>
                   <div className="text-gray-600">Missing Topmate Links</div>
                 </div>
               </div>
      </div>
    </div>
  );
};

export default Projects;
