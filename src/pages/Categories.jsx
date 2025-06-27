import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../utils/api";
import {
  FiPlus,
  FiTrash2,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [newCategory, setNewCategory] = useState({
    name: "",
    path: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // const { data } = await axios.get("/api/categories");
      const { data } = await api.get("/categories");
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch categories.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let pathValue = newCategory.path;
    if (name === "name") {
      pathValue = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    setNewCategory({ ...newCategory, [name]: value, path: pathValue });
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
      // The backend returns the newly created category
      // const { data: newCategoryData } = await axios.post(
      //   "/api/categories",
      //   newCategory,
      //   config
      // );
      const { data: newCategoryData } = await api.post(
        "/categories",
        newCategory
      );

      // Optimistically update the state
      setCategories((prevCategories) => [...prevCategories, newCategoryData]);
      setSubmitSuccess("Category added successfully!");
      setNewCategory({ name: "", path: "", description: "" });
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to add category.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitSuccess(null);
        setSubmitError(null);
      }, 5000);
    }
  };

  const handleDelete = async (id) => {
    const originalCategories = [...categories];
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat._id !== id)
    );

    try {
      // const token = localStorage.getItem("token");
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // };
      // await axios.delete(`/api/categories/${id}`, config);
      await api.delete(`/categories/${id}`);
      // No need to fetch, the state is already updated
    } catch (err) {
      // If the delete fails, revert the state
      setCategories(originalCategories);
      alert("Failed to delete category. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold font-league-spartan text-eerie-black-1 mb-8">
        Manage Categories
      </h1>

      {/* Add Category Form */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-12">
        <h2 className="text-2xl font-bold text-eerie-black-2 mb-6">
          Add New Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={newCategory.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-selective-yellow focus:border-selective-yellow"
              placeholder="e.g., Core Java"
              required
            />
          </div>
          <div>
            <label
              htmlFor="path"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL Path
            </label>
            <input
              type="text"
              name="path"
              id="path"
              value={newCategory.path}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-selective-yellow focus:border-selective-yellow"
              placeholder="e.g., core-java"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              The path is auto-generated from the name, but you can adjust it.
            </p>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              name="description"
              id="description"
              value={newCategory.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-selective-yellow focus:border-selective-yellow"
              placeholder="A brief summary of the category."
            ></textarea>
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
              <span>{isSubmitting ? "Adding..." : "Add Category"}</span>
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

      {/* Categories List */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-eerie-black-2 mb-6">
          Existing Categories
        </h2>
        {loading ? (
          <div className="flex justify-center items-center p-16">
            <FiLoader className="animate-spin text-4xl text-selective-yellow" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-4 bg-red-100 p-4 rounded-lg">
            <FiAlertTriangle className="text-red-500 text-2xl" />
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg transition-shadow hover:shadow-md"
                >
                  <Link
                    to={`/categories/${category._id}/tutorials`}
                    className="flex-grow group"
                  >
                    <p className="font-bold text-lg text-eerie-black-2 group-hover:text-selective-yellow transition-colors">
                      {category.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {category.path} - Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                    aria-label="Delete category"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No categories found. Add one using the form above.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
