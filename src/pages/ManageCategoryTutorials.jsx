import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import axios from "axios";
import api from "../utils/api";
import {
  FiPlus,
  FiTrash2,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowLeft,
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
