import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  TrendingUp,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Zap,
} from "lucide-react";
import { analyticsService } from "../services/analyticsService";

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    traffic: {},
    content: {},
    performance: {},
    users: {},
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch all analytics data in parallel
      const [overview, traffic, content, performance, users] =
        await Promise.all([
          analyticsService.getOverviewData(timeRange),
          analyticsService.getTrafficAnalytics(),
          analyticsService.getContentAnalytics(),
          analyticsService.getPerformanceData(),
          analyticsService.getUserAnalytics(),
        ]);

      setAnalyticsData({
        overview,
        traffic,
        content,
        performance,
        users,
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      // Set default data if API fails
      setAnalyticsData({
        overview: {
          totalUsers: 0,
          activeUsers: 0,
          pageViews: 0,
          sessions: 0,
          bounceRate: 0,
          avgSessionDuration: "0m 0s",
        },
        traffic: analyticsService.getDefaultTrafficData(),
        content: analyticsService.getDefaultContentData(),
        performance: analyticsService.getDefaultPerformanceData(),
        users: analyticsService.getDefaultUserData(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div
              className={`flex items-center text-sm ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  change > 0 ? "rotate-0" : "rotate-180"
                }`}
              />
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Time Range Selector */}
      <div className="mb-6 flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={analyticsData.overview.totalUsers.toLocaleString()}
          change={12.5}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={analyticsData.overview.activeUsers.toLocaleString()}
          change={8.2}
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Page Views"
          value={analyticsData.overview.pageViews.toLocaleString()}
          change={15.7}
          icon={Eye}
          color="purple"
        />
        <StatCard
          title="Avg Session"
          value={analyticsData.overview.avgSessionDuration}
          change={-2.1}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Traffic Sources */}
          <ChartCard title="Traffic Sources">
            <div className="space-y-3">
              {analyticsData.traffic.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {source.source}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Top Performing Pages */}
          <ChartCard title="Top Performing Pages">
            <div className="space-y-4">
              {analyticsData.content.topPages.map((page, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">
                      {page.page}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {page.views.toLocaleString()} views
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        page.change > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {page.change > 0 ? "+" : ""}
                      {page.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <ChartCard title="Performance Metrics">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Page Speed</span>
                  <span className="text-sm font-medium text-gray-900">
                    Desktop
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${analyticsData.performance.pageSpeed.desktop}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {analyticsData.performance.pageSpeed.desktop}/100
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Mobile</span>
                  <span className="text-sm font-medium text-gray-900">
                    {analyticsData.performance.pageSpeed.mobile}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${analyticsData.performance.pageSpeed.mobile}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </ChartCard>

          {/* Device Distribution */}
          <ChartCard title="Device Distribution">
            <div className="space-y-3">
              {analyticsData.users.devices.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {device.device === "Desktop" && (
                      <Monitor className="w-4 h-4 text-blue-600" />
                    )}
                    {device.device === "Mobile" && (
                      <Smartphone className="w-4 h-4 text-green-600" />
                    )}
                    {device.device === "Tablet" && (
                      <Monitor className="w-4 h-4 text-purple-600" />
                    )}
                    <span className="text-sm text-gray-700">
                      {device.device}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {device.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Core Web Vitals */}
          <ChartCard title="Core Web Vitals">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">LCP</span>
                <span
                  className={`text-sm font-medium ${
                    analyticsData.performance.coreWebVitals.lcp < 2.5
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {analyticsData.performance.coreWebVitals.lcp}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">FID</span>
                <span
                  className={`text-sm font-medium ${
                    analyticsData.performance.coreWebVitals.fid < 100
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {analyticsData.performance.coreWebVitals.fid}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">CLS</span>
                <span
                  className={`text-sm font-medium ${
                    analyticsData.performance.coreWebVitals.cls < 0.1
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {analyticsData.performance.coreWebVitals.cls}
                </span>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
