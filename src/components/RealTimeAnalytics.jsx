import React, { useState, useEffect } from "react";
import {
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { analyticsService } from "../services/analyticsService";

const RealTimeAnalytics = () => {
  const [realTimeData, setRealTimeData] = useState({
    currentUsers: 0,
    pageViews: 0,
    activePages: [],
    recentActivity: [],
    systemStatus: "healthy",
    errors: 0,
    warnings: 0,
  });

  useEffect(() => {
    // Fetch real-time data immediately
    fetchRealTimeData();

    // Set up interval for real-time updates
    const interval = setInterval(fetchRealTimeData, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeData = async () => {
    try {
      const data = await analyticsService.getRealTimeData();
      setRealTimeData(data);
    } catch (error) {
      console.error("Error fetching real-time data:", error);
      // Fallback to local data if API fails
      setRealTimeData(analyticsService.getLocalAnalytics());
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4" />;
      case "warning":
        return <AlertCircle className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Real-Time Analytics
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Current Users</p>
              <p className="text-2xl font-bold text-blue-900">
                {realTimeData.currentUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Page Views</p>
              <p className="text-2xl font-bold text-purple-900">
                {realTimeData.pageViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">
                System Status
              </p>
              <div className="flex items-center space-x-2">
                {getStatusIcon(realTimeData.systemStatus)}
                <span
                  className={`text-sm font-medium capitalize ${
                    getStatusColor(realTimeData.systemStatus).split(" ")[0]
                  }`}
                >
                  {realTimeData.systemStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Pages */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Currently Active Pages
        </h4>
        <div className="space-y-2">
          {realTimeData.activePages.map((page, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {page.page}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {page.users} users
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Recent Activity
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {realTimeData.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-gray-600"> {activity.action}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  activity.type === "tutorial"
                    ? "bg-blue-100 text-blue-800"
                    : activity.type === "quiz"
                    ? "bg-green-100 text-green-800"
                    : activity.type === "question"
                    ? "bg-purple-100 text-purple-800"
                    : activity.type === "project"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          System Health
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-red-600 font-medium">Errors</p>
                <p className="text-lg font-bold text-red-900">
                  {realTimeData.errors}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-sm text-yellow-600 font-medium">Warnings</p>
                <p className="text-lg font-bold text-yellow-900">
                  {realTimeData.warnings}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
