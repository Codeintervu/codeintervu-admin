import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FolderOpen,
  HelpCircle,
  Code,
  FileText,
  Search,
  Video,
  FileCode,
  PenTool,
  MessageSquare,
  Users,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch stats if we have an admin token
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      console.log("Dashboard mounted with admin token, fetching stats...");
      fetchStats();
    } else {
      console.log(
        "Dashboard mounted without admin token, skipping stats fetch"
      );
      setLoading(false);
    }
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Check if admin token exists before making API calls
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        console.log("No admin token found, skipping API calls");
        setStats([]);
        return;
      }

      console.log("Admin token found, making API calls...");

      // Fetch categories count
      const categoriesResponse = await api.get("/categories");
      const categoriesCount = categoriesResponse.data.length;

      // Fetch quiz categories count
      const quizCategoriesResponse = await api.get("/quiz/categories");
      const quizCategoriesCount = quizCategoriesResponse.data.length;

      // Fetch projects stats
      const projectsResponse = await api.get("/projects/admin/stats");
      const projectsStats = projectsResponse.data.data;

      // Fetch user stats
      const userStatsResponse = await api.get("/admin/stats");
      const userStats = userStatsResponse.data;

      const actualStats = [
        {
          name: "Categories",
          value: categoriesCount.toString(),
          icon: FolderOpen,
          color: "bg-blue-500",
          href: "/categories",
        },
        {
          name: "Quiz Categories",
          value: quizCategoriesCount.toString(),
          icon: HelpCircle,
          color: "bg-purple-500",
          href: "/quiz",
        },
        {
          name: "Projects",
          value: projectsStats.total.toString(),
          icon: Code,
          color: "bg-orange-500",
          href: "/projects",
        },
        {
          name: "Active Projects",
          value: projectsStats.active.toString(),
          icon: Code,
          color: "bg-green-500",
          href: "/projects",
        },
        {
          name: "Total Users",
          value: userStats.totalUsers.toString(),
          icon: Users,
          color: "bg-teal-500",
          href: "/users",
        },
        {
          name: "New Users (Today)",
          value: userStats.todayUsers.toString(),
          icon: Users,
          color: "bg-emerald-500",
          href: "/users",
        },

        {
          name: "Interview Questions",
          value: "0", // Will be updated when interview questions are implemented
          icon: Search,
          color: "bg-red-500",
          href: "/interview-questions",
        },
        {
          name: "Mock Interviews",
          value: "0", // Will be updated when mock interviews are implemented
          icon: Video,
          color: "bg-indigo-500",
          href: "/mock-interviews",
        },
        {
          name: "Coding Problems",
          value: "0", // Will be updated when coding problems are implemented
          icon: FileCode,
          color: "bg-yellow-500",
          href: "/coding-problems",
        },
      ];

      setStats(actualStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback to empty stats if API fails
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: "Manage Categories",
      description: "Create and manage tutorial categories",
      icon: FolderOpen,
      href: "/categories",
      color: "bg-blue-500",
    },
    {
      name: "Manage Quiz Categories",
      description: "Create and manage quiz categories",
      icon: HelpCircle,
      href: "/quiz",
      color: "bg-purple-500",
    },
    {
      name: "Manage Projects",
      description: "Create and manage projects",
      icon: Code,
      href: "/projects",
      color: "bg-orange-500",
    },

    {
      name: "Interview Questions",
      description: "Manage interview questions",
      icon: Search,
      href: "/interview-questions",
      color: "bg-red-500",
    },
    {
      name: "Mock Interviews",
      description: "Manage mock interview sessions",
      icon: Video,
      href: "/mock-interviews",
      color: "bg-indigo-500",
    },
    {
      name: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/users",
      color: "bg-teal-500",
    },
  ];

  return (
    <div>
      <AdminNavbar />
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to CodeIntervu Admin
          </h1>
          <p className="text-gray-600">
            Manage your platform content, users, and settings from this
            dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 animate-pulse"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-gray-300"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            : stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link
                    key={stat.name}
                    to={stat.href}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          {stat.name}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  to={action.href}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{action.name}</p>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity - Will be implemented with real data */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center text-gray-500 py-8">
            <p>Recent activity will be displayed here</p>
            <p className="text-sm">Coming soon with real-time data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
