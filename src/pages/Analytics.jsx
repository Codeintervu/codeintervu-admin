import React, { useState } from "react";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import RealTimeAnalytics from "../components/RealTimeAnalytics";
import {
  BarChart3,
  Activity,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Settings,
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "realtime", name: "Real-Time", icon: Activity },
    { id: "performance", name: "Performance", icon: Zap },
    { id: "users", name: "Users", icon: Users },
    { id: "content", name: "Content", icon: Eye },
    { id: "traffic", name: "Traffic", icon: Globe },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AnalyticsDashboard />;
      case "realtime":
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <RealTimeAnalytics />
          </div>
        );
      case "performance":
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Core Web Vitals
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      LCP (Largest Contentful Paint)
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      2.1s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      FID (First Input Delay)
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      45ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      CLS (Cumulative Layout Shift)
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      0.08
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Page Speed
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Desktop</span>
                      <span className="text-sm font-medium text-green-600">
                        92/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Mobile</span>
                      <span className="text-sm font-medium text-yellow-600">
                        78/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Device Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Desktop</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      65%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Mobile</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      30%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">Tablet</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      5%
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  User Growth
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Users</span>
                    <span className="text-lg font-bold text-gray-900">
                      15,420
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Active Users (30d)
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      2,847
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      New Users (7d)
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      +342
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "content":
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Performing Content
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">
                      Interview Questions
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">12.5k views</span>
                      <span className="text-sm font-medium text-green-600">
                        +12.5%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">
                      Java Tutorials
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">8.9k views</span>
                      <span className="text-sm font-medium text-green-600">
                        +8.2%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">
                      Projects
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">6.7k views</span>
                      <span className="text-sm font-medium text-red-600">
                        -2.1%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Content Categories
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Core Java</span>
                    <span className="text-sm font-medium text-gray-900">
                      85% engagement
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Data Structures
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      78% engagement
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Algorithms</span>
                    <span className="text-sm font-medium text-gray-900">
                      72% engagement
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "traffic":
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Traffic Sources
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Direct</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        45%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Organic Search
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "30%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        30%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Social Media</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: "15%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        15%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Geographic Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">United States</span>
                    <span className="text-sm font-medium text-gray-900">
                      40%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">India</span>
                    <span className="text-sm font-medium text-gray-900">
                      25%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      United Kingdom
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      15%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Canada</span>
                    <span className="text-sm font-medium text-gray-900">
                      10%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-2xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Google Analytics
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Measurement ID
                    </label>
                    <input
                      type="text"
                      placeholder="G-XXXXXXXXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="ga-enabled"
                      className="rounded border-gray-300"
                    />
                    <label
                      htmlFor="ga-enabled"
                      className="text-sm text-gray-700"
                    >
                      Enable Google Analytics tracking
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="bg-gray-50">
      <AdminNavbar />
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">
              Monitor your site's performance and user engagement
            </p>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-3 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default Analytics;
