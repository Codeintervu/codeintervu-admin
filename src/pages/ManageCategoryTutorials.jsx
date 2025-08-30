import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import axios from "axios";
import api from "../utils/api";
import AdminNavbar from "../components/AdminNavbar";
import {
  FiPlus,
  FiTrash2,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowLeft,
  FiImage,
  FiUpload,
} from "react-icons/fi";

const ManageCategoryTutorials = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTutorialTitle, setNewTutorialTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Ad management state
  const [adImage, setAdImage] = useState(null);
  const [adImageUrl, setAdImageUrl] = useState("");
  const [isUploadingAd, setIsUploadingAd] = useState(false);
  const [adUploadSuccess, setAdUploadSuccess] = useState(null);
  const [adUploadError, setAdUploadError] = useState(null);

  // Top banner ad management state
  const [topBannerAdImage, setTopBannerAdImage] = useState(null);
  const [topBannerAdImageUrl, setTopBannerAdImageUrl] = useState("");
  const [isUploadingTopBannerAd, setIsUploadingTopBannerAd] = useState(false);
  const [topBannerAdUploadSuccess, setTopBannerAdUploadSuccess] =
    useState(null);
  const [topBannerAdUploadError, setTopBannerAdUploadError] = useState(null);

  const fetchTutorials = async () => {
    try {
      setLoading(true);

      // There isn't a single category fetch endpoint, so we get all and find ours.
      // This is inefficient but works with the current backend.
      // const categoryRes = await axios.get(`/api/categories`);
      const categoryRes = await api.get(`/categories`);
      const currentCategory = categoryRes.data.find(
        (c) => c._id === categoryId
      );
      setCategory(currentCategory);

      if (!currentCategory) {
        throw new Error("Category not found");
      }

      // Fetch tutorials for this category
      // const tutorialsRes = await axios.get(
      //   `/api/tutorials?category=${categoryId}`
      // );
      const tutorialsRes = await api.get(`/tutorials?category=${categoryId}`);
      setTutorials(tutorialsRes.data);

      // Fetch existing ad image for this category
      try {
        const adRes = await api.get(`/categories/${categoryId}/ad`);
        if (adRes.data && adRes.data.adImageUrl) {
          setAdImageUrl(adRes.data.adImageUrl);
        }
      } catch (adErr) {
        // No ad image exists yet, which is fine
        if (adErr.response?.status === 404) {
          console.log("No ad image found for this category");
        } else {
          console.error(
            "Error fetching ad image:",
            adErr.response?.status,
            adErr.response?.data
          );
        }
      }

      // Fetch existing top banner ad image for this category
      try {
        const topBannerAdRes = await api.get(
          `/categories/${categoryId}/top-banner-ad`
        );
        if (topBannerAdRes.data && topBannerAdRes.data.adImageUrl) {
          setTopBannerAdImageUrl(topBannerAdRes.data.adImageUrl);
        }
      } catch (topBannerAdErr) {
        // No top banner ad image exists yet, which is fine
        if (topBannerAdErr.response?.status === 404) {
          console.log("No top banner ad image found for this category");
        } else {
          console.error(
            "Error fetching top banner ad image:",
            topBannerAdErr.response?.status,
            topBannerAdErr.response?.data
          );
        }
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data for this category.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, [categoryId]);

  const handleInputChange = (e) => {
    setNewTutorialTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      // const token = localStorage.getItem("token");
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // };
      const body = { title: newTutorialTitle, category: categoryId };
      // await axios.post("/api/tutorials", body, config);
      await api.post("/tutorials", body);

      setSubmitSuccess("Tutorial added successfully!");
      setNewTutorialTitle("");
      fetchTutorials(); // Refresh the list
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to add tutorial.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitSuccess(null);
        setSubmitError(null);
      }, 5000);
    }
  };

  const handleTopBannerAdUpload = async (e) => {
    e.preventDefault();
    if (!topBannerAdImage) {
      setTopBannerAdUploadError("Please select an image to upload.");
      return;
    }

    setIsUploadingTopBannerAd(true);
    setTopBannerAdUploadError(null);
    setTopBannerAdUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("adImage", topBannerAdImage);

      const response = await api.post(
        `/categories/${categoryId}/top-banner-ad`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTopBannerAdImageUrl(response.data.adImageUrl);
      setTopBannerAdImage(null);
      setTopBannerAdUploadSuccess("Top banner ad image uploaded successfully!");

      // Clear the file input
      const fileInput = document.getElementById("topBannerAdImageInput");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(
        "Top banner ad upload error:",
        err.response?.status,
        err.response?.data
      );
      setTopBannerAdUploadError(
        err.response?.data?.message ||
          `Failed to upload top banner ad image. (${
            err.response?.status || "Unknown error"
          })`
      );
    } finally {
      setIsUploadingTopBannerAd(false);
      setTimeout(() => {
        setTopBannerAdUploadSuccess(null);
        setTopBannerAdUploadError(null);
      }, 5000);
    }
  };

  const handleDelete = async (tutorialId) => {
    if (window.confirm("Are you sure you want to delete this tutorial?")) {
      try {
        // const token = localStorage.getItem("token");
        // const config = { headers: { Authorization: `Bearer ${token}` } };
        // await axios.delete(`/api/tutorials/${tutorialId}`, config);
        await api.delete(`/tutorials/by-id/${tutorialId}`);
        fetchTutorials(); // Refresh the list
      } catch (err) {
        alert("Failed to delete tutorial.");
      }
    }
  };

  // Ad image upload handlers
  const handleAdImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setAdImage(file);
        setAdUploadError(null);
      } else {
        setAdUploadError("Please select a valid image file.");
        setAdImage(null);
      }
    }
  };

  // Top banner ad image upload handlers
  const handleTopBannerAdImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setTopBannerAdImage(file);
        setTopBannerAdUploadError(null);
      } else {
        setTopBannerAdUploadError("Please select a valid image file.");
        setTopBannerAdImage(null);
      }
    }
  };

  const handleAdUpload = async (e) => {
    e.preventDefault();
    if (!adImage) {
      setAdUploadError("Please select an image to upload.");
      return;
    }

    setIsUploadingAd(true);
    setAdUploadError(null);
    setAdUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("adImage", adImage);

      const response = await api.post(
        `/categories/${categoryId}/ad`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAdImageUrl(response.data.adImageUrl);
      setAdImage(null);
      setAdUploadSuccess("Ad image uploaded successfully!");

      // Clear the file input
      const fileInput = document.getElementById("adImageInput");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(
        "Ad upload error:",
        err.response?.status,
        err.response?.data
      );
      setAdUploadError(
        err.response?.data?.message ||
          `Failed to upload ad image. (${
            err.response?.status || "Unknown error"
          })`
      );
    } finally {
      setIsUploadingAd(false);
      setTimeout(() => {
        setAdUploadSuccess(null);
        setAdUploadError(null);
      }, 5000);
    }
  };

  const handleRemoveAd = async () => {
    if (window.confirm("Are you sure you want to remove the ad image?")) {
      try {
        await api.delete(`/categories/${categoryId}/ad`);
        setAdImageUrl("");
        setAdUploadSuccess("Ad image removed successfully!");
        setTimeout(() => {
          setAdUploadSuccess(null);
        }, 5000);
      } catch (err) {
        setAdUploadError("Failed to remove ad image.");
      }
    }
  };

  const handleRemoveTopBannerAd = async () => {
    if (
      window.confirm("Are you sure you want to remove the top banner ad image?")
    ) {
      try {
        await api.delete(`/categories/${categoryId}/top-banner-ad`);
        setTopBannerAdImageUrl("");
        setTopBannerAdUploadSuccess(
          "Top banner ad image removed successfully!"
        );
        setTimeout(() => {
          setTopBannerAdUploadSuccess(null);
        }, 5000);
      } catch (err) {
        setTopBannerAdUploadError("Failed to remove top banner ad image.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <FiLoader className="animate-spin text-4xl text-selective-yellow" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-4 bg-red-100 p-4 rounded-lg">
        <FiAlertTriangle className="text-red-500 text-2xl" />
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <Link
        to="/categories"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-eerie-black-1 mb-6"
      >
        <FiArrowLeft />
        <span>Back to Categories</span>
      </Link>
      <h1 className="text-4xl font-bold font-league-spartan text-eerie-black-1 mb-2">
        Manage Tutorials for{" "}
        <span className="text-selective-yellow">{category?.name}</span>
      </h1>
      <p className="text-gray-500 mb-8">
        Add, edit, or remove tutorials within this category.
      </p>

      {/* Add Tutorial Form */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-12">
        <h2 className="text-2xl font-bold text-eerie-black-2 mb-6">
          Add New Tutorial
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tutorial Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={newTutorialTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-selective-yellow focus:border-selective-yellow"
              placeholder="e.g., Java Features"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-selective-yellow text-eerie-black-1 px-5 py-3 rounded-lg hover:bg-yellow-500 font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiPlus />
              )}
              <span>{isSubmitting ? "Adding..." : "Add Tutorial"}</span>
            </button>
            {submitSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <FiCheckCircle />
                <span>{submitSuccess}</span>
              </div>
            )}
            {submitError && (
              <div className="flex items-center gap-2 text-red-600">
                <FiAlertTriangle />
                <span>{submitError}</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Ad Management Section */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold text-eerie-black-2 mb-6">
          Right Side Ad Management
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Upload an image to display as an advertisement on the right side of
          all tutorial pages in this category.
        </p>

        {/* Current Ad Display */}
        {adImageUrl && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-eerie-black-2 mb-3">
              Current Ad Image:
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={adImageUrl}
                alt="Current ad"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <button
                onClick={handleRemoveAd}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                aria-label="Remove ad image"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Upload New Ad */}
        <form onSubmit={handleAdUpload} className="space-y-4">
          <div>
            <label
              htmlFor="adImageInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Ad Image
            </label>
            <input
              type="file"
              id="adImageInput"
              accept="image/*"
              onChange={handleAdImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-selective-yellow focus:border-selective-yellow"
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 300x600px or similar aspect ratio for best
              display on the right sidebar.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isUploadingAd || !adImage}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingAd ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiUpload />
              )}
              <span>{isUploadingAd ? "Uploading..." : "Upload Ad Image"}</span>
            </button>

            {adUploadSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <FiCheckCircle />
                <span>{adUploadSuccess}</span>
              </div>
            )}
            {adUploadError && (
              <div className="flex items-center gap-2 text-red-600">
                <FiAlertTriangle />
                <span>{adUploadError}</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Top Banner Ad Management Section */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold text-eerie-black-2 mb-6">
          Top Banner Ad Management
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Upload an image to display as a horizontal banner advertisement at the
          top of all tutorial pages in this category.
        </p>

        {/* Current Top Banner Ad Display */}
        {topBannerAdImageUrl && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-eerie-black-2 mb-3">
              Current Top Banner Ad Image:
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={topBannerAdImageUrl}
                alt="Current top banner ad"
                className="w-64 h-16 object-cover rounded-lg border"
              />
              <button
                onClick={handleRemoveTopBannerAd}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                aria-label="Remove top banner ad image"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Upload New Top Banner Ad */}
        <form onSubmit={handleTopBannerAdUpload} className="space-y-4">
          <div>
            <label
              htmlFor="topBannerAdImageInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Top Banner Ad Image
            </label>
            <input
              type="file"
              id="topBannerAdImageInput"
              accept="image/*"
              onChange={handleTopBannerAdImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-selective-yellow focus:border-selective-yellow"
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 1200x120px for desktop, full width x 100px for
              mobile.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isUploadingTopBannerAd || !topBannerAdImage}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingTopBannerAd ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiUpload />
              )}
              <span>
                {isUploadingTopBannerAd
                  ? "Uploading..."
                  : "Upload Top Banner Ad Image"}
              </span>
            </button>

            {topBannerAdUploadSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <FiCheckCircle />
                <span>{topBannerAdUploadSuccess}</span>
              </div>
            )}
            {topBannerAdUploadError && (
              <div className="flex items-center gap-2 text-red-600">
                <FiAlertTriangle />
                <span>{topBannerAdUploadError}</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Tutorials List */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-eerie-black-2 mb-6">
          Existing Tutorials in {category?.name}
        </h2>
        <div className="space-y-4">
          {tutorials.length > 0 ? (
            tutorials.map((tutorial) => (
              <div
                key={tutorial._id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg transition-shadow hover:shadow-md"
              >
                <Link
                  to={`/tutorials/by-id/${tutorial._id}/sections`}
                  className="flex-grow group"
                >
                  <p className="font-bold text-lg text-eerie-black-2 group-hover:text-selective-yellow transition-colors">
                    {tutorial.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tutorial.sections?.length || 0} Sections - Last updated:{" "}
                    {(() => {
                      const date = tutorial.updatedAt || tutorial.createdAt;
                      if (!date) return "N/A";
                      const d = new Date(date);
                      return isNaN(d) ? "N/A" : d.toLocaleDateString();
                    })()}
                  </p>
                </Link>
                <button
                  onClick={() => handleDelete(tutorial._id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                  aria-label="Delete tutorial"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              No tutorials found for this category yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCategoryTutorials;
