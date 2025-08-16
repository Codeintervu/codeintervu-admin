import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../utils/api";
import {
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiExternalLink,
  FiYoutube,
  FiImage,
  FiCode,
  FiShield,
  FiUsers,
  FiServer,
  FiDatabase,
  FiGlobe,
  FiSettings,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiPlay,
  FiX,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/admin/${id}`);
      setProject(response.data.data);
    } catch (error) {
      console.error("Error fetching project:", error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setLoading(true);
        await api.delete(`/projects/admin/${id}`);
        navigate("/projects");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      await api.patch(`/projects/admin/${id}/toggle-status`);
      
      // Refresh project data
      await fetchProject();
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
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <AdminNavbar />
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Project Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The project you're looking for doesn't exist.
            </p>
            <Link
              to="/projects"
              className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700"
            >
              Back to Projects
            </Link>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
              <p className="text-gray-600 mt-1">Project Details & Preview</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {showPreview ? (
                <FiEyeOff className="w-4 h-4" />
              ) : (
                <FiEye className="w-4 h-4" />
              )}
              <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
            </button>
            <Link
              to={`/projects/${id}/edit`}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              <FiEdit className="w-4 h-4" />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <p className="text-gray-900">{project.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Key
                  </label>
                  <p className="text-gray-900 font-mono">{project.key}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900">{project.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Real Price
                  </label>
                  <p className="text-gray-900">₹{project.realPrice}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Price
                  </label>
                  <p className="text-green-600 font-semibold">
                    ₹{project.offerPrice}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <p className="text-gray-900">{project.order}</p>
                </div>
              </div>
            </div>

            {/* Topmate Link */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Topmate Integration
              </h2>
              <div className="flex items-center space-x-2">
                <FiExternalLink className="w-5 h-5 text-blue-600" />
                <a
                  href={project.topmateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {project.topmateLink}
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Project Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FiCheck className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Technology Stack
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frontend
                  </label>
                  <p className="text-gray-900">{project.techStack.frontend}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backend
                  </label>
                  <p className="text-gray-900">{project.techStack.backend}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Database
                  </label>
                  <p className="text-gray-900">{project.techStack.database}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Others
                  </label>
                  <p className="text-gray-900">{project.techStack.others}</p>
                </div>
              </div>
            </div>

            {/* Authentication */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Authentication Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.authentication.map((auth, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FiShield className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{auth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Admin Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.adminFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FiSettings className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Deployment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frontend
                  </label>
                  <p className="text-gray-900">{project.deployment.frontend}</p>
                  {project.deployment.frontendLink && (
                    <a
                      href={project.deployment.frontendLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {project.deployment.frontendLink}
                    </a>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backend
                  </label>
                  <p className="text-gray-900">{project.deployment.backend}</p>
                  {project.deployment.backendLink && (
                    <a
                      href={project.deployment.backendLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {project.deployment.backendLink}
                    </a>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Database
                  </label>
                  <p className="text-gray-900">{project.deployment.database}</p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Additional Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unique Selling Point
                  </label>
                  <p className="text-gray-900">{project.usp}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testing & Security
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.testingSecurity.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scalability Features
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.scalability.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Users
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.users.map((user, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FiUsers className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{user}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Image
              </h3>
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* Screenshots */}
            {project.screenshots.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Screenshots
                </h3>
                <div className="space-y-3">
                  {project.screenshots.map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Demo Video */}
            {project.demoVideo && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Demo Video
                </h3>
                <div className="flex items-center space-x-2">
                  <FiYoutube className="w-5 h-5 text-red-600" />
                  <a
                    href={project.demoVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Watch Demo
                  </a>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleToggleStatus}
                  disabled={loading}
                  className={`w-full px-4 py-2 rounded-md font-medium ${
                    project.isActive
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } disabled:opacity-50`}
                >
                  {project.isActive ? "Deactivate" : "Activate"}
                </button>
                <Link
                  to={`/projects/${id}/edit`}
                  className="block w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-medium text-center"
                >
                  Edit Project
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Frontend Preview
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-gray-100 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {project.name}
                  </h1>
                  <p className="text-gray-600 mb-6">{project.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Features
                      </h3>
                      <ul className="space-y-1">
                        {project.features.slice(0, 5).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <FiCheck className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Tech Stack
                      </h3>
                      <div className="space-y-1">
                        <p className="text-gray-700">
                          <strong>Frontend:</strong>{" "}
                          {project.techStack.frontend}
                        </p>
                        <p className="text-gray-700">
                          <strong>Backend:</strong> {project.techStack.backend}
                        </p>
                        <p className="text-gray-700">
                          <strong>Database:</strong>{" "}
                          {project.techStack.database}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 line-through text-lg">
                        ₹{project.realPrice}
                      </span>
                      <span className="text-green-600 font-bold text-2xl ml-2">
                        ₹{project.offerPrice}
                      </span>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;

