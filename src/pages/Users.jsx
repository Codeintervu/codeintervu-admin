import React, { useState, useEffect } from "react";
import {
  Users as UsersIcon,
  Search,
  Mail,
  Calendar,
  Phone,
  Trash2,
  Eye,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  ExternalLink,
  Globe,
  BookOpen,
  Shield,
  X,
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../utils/api";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/admin/users/${userToDelete._id}`);

      // Remove user from state
      setUsers(users.filter((user) => user._id !== userToDelete._id));
      setFilteredUsers(
        filteredUsers.filter((user) => user._id !== userToDelete._id)
      );

      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                View and manage all registered users on the platform.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-8 h-8 text-teal-600" />
              <span className="text-2xl font-bold text-gray-900">
                {users.length}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Registered Users ({filteredUsers.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <UsersIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No users have registered yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-teal-600 font-semibold text-sm">
                              {user.fullName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {user.email}
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {user.phoneNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {user.bio && (
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {user.bio}
                            </div>
                          )}
                          {user.learningPreferences?.difficultyLevel && (
                            <div className="text-xs text-gray-500">
                              Level: {user.learningPreferences.difficultyLevel}
                            </div>
                          )}
                          {user.learningPreferences?.learningGoals && (
                            <div className="text-xs text-gray-500">
                              Goal: {user.learningPreferences.learningGoals}
                            </div>
                          )}
                          {user.privacySettings?.profileVisibility && (
                            <div className="text-xs text-gray-500">
                              Visibility:{" "}
                              {user.privacySettings.profileVisibility}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-teal-500">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-emerald-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    users.filter((user) => {
                      const userDate = new Date(user.createdAt);
                      const now = new Date();
                      return (
                        userDate.getMonth() === now.getMonth() &&
                        userDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    users.filter((user) => {
                      const userDate = new Date(user.createdAt);
                      const now = new Date();
                      const weekAgo = new Date(
                        now.getTime() - 7 * 24 * 60 * 60 * 1000
                      );
                      return userDate >= weekAgo;
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    users.filter((user) => {
                      const userDate = new Date(user.createdAt);
                      const now = new Date();
                      return userDate.toDateString() === now.toDateString();
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete User
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {userToDelete?.fullName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {detailModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                User Details - {selectedUser.fullName}
              </h3>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Basic Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-gray-900">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone Number
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User ID
                    </label>
                    <p className="text-gray-900 text-sm font-mono">
                      {selectedUser._id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Joined
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Profile Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Bio
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.bio || "No bio provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Profile Picture
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.profilePicture || "No profile picture"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Social Links
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.socialLinks?.github || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.socialLinks?.linkedin || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.socialLinks?.instagram || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter/X
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.socialLinks?.twitter || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Portfolio
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.socialLinks?.portfolio || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.socialLinks?.website || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Learning Preferences */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learning Preferences
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Preferred Languages
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUser.learningPreferences?.preferredLanguages
                        ?.length > 0 ? (
                        selectedUser.learningPreferences.preferredLanguages.map(
                          (lang, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                            >
                              {lang}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">
                          None selected
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Difficulty Level
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.learningPreferences?.difficultyLevel ||
                        "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Learning Goals
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.learningPreferences?.learningGoals ||
                        "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy Settings
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Profile Visibility
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.privacySettings?.profileVisibility ||
                        "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Show Email
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.privacySettings?.showEmail ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Show Phone
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.privacySettings?.showPhone ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Allow Messages
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.privacySettings?.allowMessages
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Account Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Terms Accepted
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.termsAccepted ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Account Status
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Enrolled Courses
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.enrolledCourses?.length || 0} courses
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Wishlist Items
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.wishlist?.length || 0} items
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
