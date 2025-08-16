import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  FolderOpen,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  HelpCircle,
  MessageSquare,
  BarChart3,
  CreditCard,
  Code,
  FileCode,
  PenTool,
  Video,
  Search,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isContentDropdownOpen, setIsContentDropdownOpen] = useState(false);
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] =
    useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Categories", href: "/categories", icon: FolderOpen },
    { name: "Quiz", href: "/quiz", icon: HelpCircle },
    { name: "Projects", href: "/projects", icon: Code },
    { name: "Resume Builder", href: "/resume-builder", icon: FileText },
    { name: "Interview Questions", href: "/interview-questions", icon: Search },
    { name: "Mock Interviews", href: "/mock-interviews", icon: Video },
    { name: "Coding Problems", href: "/coding-problems", icon: FileCode },
    { name: "Whiteboard", href: "/whiteboard", icon: PenTool },
    { name: "Blog", href: "/blog", icon: MessageSquare },
    { name: "Contact Messages", href: "/contact", icon: MessageSquare },
    { name: "Users", href: "/users", icon: Users },
    { name: "Payments", href: "/payments", icon: CreditCard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  // Group navigation items for dropdowns
  const contentItems = [
    { name: "Categories", href: "/categories", icon: FolderOpen },
    { name: "Quiz", href: "/quiz", icon: HelpCircle },
    { name: "Projects", href: "/projects", icon: Code },
    { name: "Resume Builder", href: "/resume-builder", icon: FileText },
  ];

  const managementItems = [
    { name: "Interview Questions", href: "/interview-questions", icon: Search },
    { name: "Mock Interviews", href: "/mock-interviews", icon: Video },
    { name: "Coding Problems", href: "/coding-problems", icon: FileCode },
    { name: "Whiteboard", href: "/whiteboard", icon: PenTool },
    { name: "Blog", href: "/blog", icon: MessageSquare },
    { name: "Contact Messages", href: "/contact", icon: MessageSquare },
    { name: "Users", href: "/users", icon: Users },
    { name: "Payments", href: "/payments", icon: CreditCard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                CodeIntervu Admin
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
              {/* Dashboard */}
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/")
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>

              {/* Content Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsContentDropdownOpen(!isContentDropdownOpen)
                  }
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    contentItems.some((item) => isActive(item.href))
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Content
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {isContentDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {contentItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            isActive(item.href)
                              ? "bg-teal-50 text-teal-700"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          onClick={() => setIsContentDropdownOpen(false)}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Management Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsManagementDropdownOpen(!isManagementDropdownOpen)
                  }
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    managementItems.some((item) => isActive(item.href))
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Management
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {isManagementDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {managementItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            isActive(item.href)
                              ? "bg-teal-50 text-teal-700"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          onClick={() => setIsManagementDropdownOpen(false)}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {/* Dashboard */}
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActive("/")
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </div>
            </Link>

            {/* Content Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Content
              </div>
              {contentItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-teal-50 text-teal-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Management Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Management
              </div>
              {managementItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-teal-50 text-teal-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
