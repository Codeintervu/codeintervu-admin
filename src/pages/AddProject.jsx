import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../utils/api";
import {
  FiPlus,
  FiX,
  FiUpload,
  FiEye,
  FiEyeOff,
  FiSave,
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
  FiAlertCircle,
} from "react-icons/fi";

const AddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [project, setProject] = useState({
    name: "",
    key: "",
    description: "",
    realPrice: 0,
    offerPrice: 0,
    image: "",
    topmateLink: "",
    features: [],
    techStack: {
      frontend: "",
      backend: "",
      database: "",
      others: "",
    },
    screenshots: [],
    demoVideo: "",
    authentication: [],
    adminFeatures: [],
    deployment: {
      frontend: "",
      backend: "",
      database: "",
      frontendLink: "",
      backendLink: "",
    },
    usp: "",
    testingSecurity: [],
    scalability: [],
    users: [],
    isActive: true,
    order: 0,
  });

  const [newFeature, setNewFeature] = useState("");
  const [newAuth, setNewAuth] = useState("");
  const [newAdminFeature, setNewAdminFeature] = useState("");
  const [newTesting, setNewTesting] = useState("");
  const [newScalability, setNewScalability] = useState("");
  const [newUser, setNewUser] = useState("");

  const tabs = [
    { id: "basic", name: "Basic Info", icon: FiEye },
    { id: "topmate", name: "Topmate Link", icon: FiExternalLink },
    { id: "media", name: "Media", icon: FiImage },
    { id: "features", name: "Features", icon: FiCheck },
    { id: "tech", name: "Tech Stack", icon: FiCode },
    { id: "auth", name: "Authentication", icon: FiShield },
    { id: "admin", name: "Admin Features", icon: FiSettings },
    { id: "deployment", name: "Deployment", icon: FiServer },
    { id: "details", name: "Additional Details", icon: FiUsers },
  ];

  const handleInputChange = (field, value) => {
    setProject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setProject((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field, value) => {
    setProject((prev) => ({
      ...prev,
      [field]: [...prev[field], value],
    }));
  };

  const removeFromArray = (field, index) => {
    setProject((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProject((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProject((prev) => ({
          ...prev,
          screenshots: [...prev.screenshots, e.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/projects/admin", project);
      navigate("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      if (error.response?.data?.errors) {
        alert(`Validation errors: ${error.response.data.errors.join(", ")}`);
      } else {
        alert("Failed to create project. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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
                Add New Project
              </h1>
              <p className="text-gray-600 mt-1">
                Create a new project with all details and Topmate integration
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? "border-teal-500 text-teal-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter project name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Key *
                      </label>
                      <input
                        type="text"
                        value={project.key}
                        onChange={(e) =>
                          handleInputChange("key", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., springboot-ecommerce"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={project.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter project description"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Real Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={project.realPrice}
                        onChange={(e) =>
                          handleInputChange(
                            "realPrice",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="1999"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={project.offerPrice}
                        onChange={(e) =>
                          handleInputChange(
                            "offerPrice",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="999"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={project.order}
                        onChange={(e) =>
                          handleInputChange(
                            "order",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={project.isActive}
                        onChange={(e) =>
                          handleInputChange(
                            "isActive",
                            e.target.value === "true"
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "topmate" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topmate Link
                    </label>
                    <input
                      type="url"
                      value={project.topmateLink}
                      onChange={(e) =>
                        handleInputChange("topmateLink", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="https://topmate.io/your-project"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This link will be used for the "Buy Now" button
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Image
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Add a project image to make your project more attractive.
                      This field is optional.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={project.image}
                          onChange={(e) =>
                            handleInputChange("image", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="https://example.com/image.jpg (optional)"
                        />
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Image from Device (Optional)
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                          />
                          {project.image && (
                            <button
                              type="button"
                              onClick={() => handleInputChange("image", "")}
                              className="px-3 py-2 text-red-600 hover:text-red-800 text-sm"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        {project.image && (
                          <div className="mt-2">
                            <img
                              src={project.image}
                              alt="Project preview"
                              className="w-32 h-32 object-cover rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demo Video
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Add a demo video to showcase your project functionality.
                      This field is optional.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video URL
                        </label>
                        <input
                          type="url"
                          value={project.demoVideo}
                          onChange={(e) =>
                            handleInputChange("demoVideo", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Video from Device
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  handleInputChange(
                                    "demoVideo",
                                    e.target.result
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                          />
                          {project.demoVideo && (
                            <button
                              type="button"
                              onClick={() => handleInputChange("demoVideo", "")}
                              className="px-3 py-2 text-red-600 hover:text-red-800 text-sm"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        {project.demoVideo &&
                          project.demoVideo.startsWith("data:video") && (
                            <div className="mt-2">
                              <video
                                src={project.demoVideo}
                                controls
                                className="w-full max-w-md rounded-md border"
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Screenshots
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Screenshots from Device
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleScreenshotUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          You can select multiple images at once
                        </p>
                      </div>
                      {project.screenshots.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Uploaded Screenshots ({project.screenshots.length})
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {project.screenshots.map((screenshot, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={screenshot}
                                  alt={`Screenshot ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-md border"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFromArray("screenshots", index)
                                  }
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  <FiX className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Features
                    </label>
                    <div className="space-y-2">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...project.features];
                              newFeatures[index] = e.target.value;
                              handleInputChange("features", newFeatures);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter feature"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFeatures = project.features.filter(
                                (_, i) => i !== index
                              );
                              handleInputChange("features", newFeatures);
                            }}
                            className="px-3 py-2 text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleArrayChange("features", "")}
                        className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tech" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frontend Technologies
                      </label>
                      <input
                        type="text"
                        value={project.techStack.frontend}
                        onChange={(e) =>
                          handleNestedChange(
                            "techStack",
                            "frontend",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="React, HTML, CSS, JavaScript"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backend Technologies
                      </label>
                      <input
                        type="text"
                        value={project.techStack.backend}
                        onChange={(e) =>
                          handleNestedChange(
                            "techStack",
                            "backend",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Node.js, Express, Python, Django"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Database
                      </label>
                      <input
                        type="text"
                        value={project.techStack.database}
                        onChange={(e) =>
                          handleNestedChange(
                            "techStack",
                            "database",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="MongoDB, MySQL, PostgreSQL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other Technologies
                      </label>
                      <input
                        type="text"
                        value={project.techStack.others}
                        onChange={(e) =>
                          handleNestedChange(
                            "techStack",
                            "others",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Docker, AWS, Git, etc."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "auth" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Authentication Features
                    </label>
                    <div className="space-y-2">
                      {project.authentication.map((auth, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={auth}
                            onChange={(e) => {
                              const newAuth = [...project.authentication];
                              newAuth[index] = e.target.value;
                              handleInputChange("authentication", newAuth);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter authentication feature"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newAuth = project.authentication.filter(
                                (_, i) => i !== index
                              );
                              handleInputChange("authentication", newAuth);
                            }}
                            className="px-3 py-2 text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleArrayChange("authentication", "")}
                        className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add Authentication Feature
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "admin" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Features
                    </label>
                    <div className="space-y-2">
                      {project.adminFeatures.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...project.adminFeatures];
                              newFeatures[index] = e.target.value;
                              handleInputChange("adminFeatures", newFeatures);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter admin feature"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFeatures = project.adminFeatures.filter(
                                (_, i) => i !== index
                              );
                              handleInputChange("adminFeatures", newFeatures);
                            }}
                            className="px-3 py-2 text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleArrayChange("adminFeatures", "")}
                        className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add Admin Feature
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "deployment" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frontend Platform
                      </label>
                      <input
                        type="text"
                        value={project.deployment.frontend}
                        onChange={(e) =>
                          handleNestedChange(
                            "deployment",
                            "frontend",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Netlify, Vercel, AWS S3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backend Platform
                      </label>
                      <input
                        type="text"
                        value={project.deployment.backend}
                        onChange={(e) =>
                          handleNestedChange(
                            "deployment",
                            "backend",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Render, Heroku, AWS EC2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Database Platform
                      </label>
                      <input
                        type="text"
                        value={project.deployment.database}
                        onChange={(e) =>
                          handleNestedChange(
                            "deployment",
                            "database",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="MongoDB Atlas, AWS RDS"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frontend Link
                      </label>
                      <input
                        type="url"
                        value={project.deployment.frontendLink}
                        onChange={(e) =>
                          handleNestedChange(
                            "deployment",
                            "frontendLink",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="https://your-app.netlify.app"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backend Link
                      </label>
                      <input
                        type="url"
                        value={project.deployment.backendLink}
                        onChange={(e) =>
                          handleNestedChange(
                            "deployment",
                            "backendLink",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="https://your-api.onrender.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unique Selling Point (USP)
                    </label>
                    <textarea
                      value={project.usp}
                      onChange={(e) => handleInputChange("usp", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="What makes this project unique?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testing & Security Features
                    </label>
                    <div className="space-y-2">
                      {project.testingSecurity.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...project.testingSecurity];
                              newItems[index] = e.target.value;
                              handleInputChange("testingSecurity", newItems);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter testing/security feature"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = project.testingSecurity.filter(
                                (_, i) => i !== index
                              );
                              handleInputChange("testingSecurity", newItems);
                            }}
                            className="px-3 py-2 text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleArrayChange("testingSecurity", "")}
                        className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add Testing/Security Feature
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scalability Features
                    </label>
                    <div className="space-y-2">
                      {project.scalability.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...project.scalability];
                              newItems[index] = e.target.value;
                              handleInputChange("scalability", newItems);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter scalability feature"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = project.scalability.filter(
                                (_, i) => i !== index
                              );
                              handleInputChange("scalability", newItems);
                            }}
                            className="px-3 py-2 text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleArrayChange("scalability", "")}
                        className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add Scalability Feature
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Users
                    </label>
                    <div className="space-y-2">
                      {project.users.map((user, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={user}
                            onChange={(e) => {
                              const newUsers = [...project.users];
                              newUsers[index] = e.target.value;
                              handleInputChange("users", newUsers);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter target user"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newUsers = project.users.filter(
                                (_, i) => i !== index
                              );
                              handleInputChange("users", newUsers);
                            }}
                            className="px-3 py-2 text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleArrayChange("users", "")}
                        className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add Target User
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/projects"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  <span>Save Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
