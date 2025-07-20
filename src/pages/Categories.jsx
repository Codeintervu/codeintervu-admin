import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../utils/api";
import {
  FiPlus,
  FiTrash2,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiMove,
  FiSave,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [orderUpdateSuccess, setOrderUpdateSuccess] = useState(null);

  const [newCategory, setNewCategory] = useState({
    name: "",
    path: "",
    description: "",
    order: 0,
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
      setNewCategory({ name: "", path: "", description: "", order: 0 });
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
      await api.delete(`/categories/by-id/${id}`);
      // No need to fetch, the state is already updated
    } catch (err) {
      // If the delete fails, revert the state
      setCategories(originalCategories);
      alert("Failed to delete category. Please try again.");
    }
  };

  // Handle order input change for individual categories
  const handleOrderChange = (categoryId, newOrder) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat._id === categoryId
          ? { ...cat, order: parseInt(newOrder) || 0 }
          : cat
      )
    );
  };

  // Update category order in backend
  const handleUpdateOrder = async () => {
    setIsUpdatingOrder(true);
    setOrderUpdateSuccess(null);

    try {
      const categoryOrders = categories.map((cat, index) => ({
        categoryId: cat._id,
        order: cat.order || index + 1,
      }));

      await api.put("/categories/order", { categoryOrders });
      setOrderUpdateSuccess("Category order updated successfully!");

      // Refresh categories to get the sorted order
      await fetchCategories();
    } catch (err) {
      setSubmitError("Failed to update category order.");
    } finally {
      setIsUpdatingOrder(false);
      setTimeout(() => {
        setOrderUpdateSuccess(null);
        setSubmitError(null);
      }, 5000);
    }
  };

  // Drag and drop functionality
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[dragIndex];

    // Remove the dragged item
    newCategories.splice(dragIndex, 1);

    // Insert at the new position
    newCategories.splice(dropIndex, 0, draggedItem);

    // Update order numbers
    const updatedCategories = newCategories.map((cat, index) => ({
      ...cat,
      order: index + 1,
    }));

    setCategories(updatedCategories);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link
          to="/quiz"
          className="flex items-center gap-2 bg-selective-yellow text-eerie-black-1 px-5 py-3 rounded-lg hover:bg-yellow-500 font-bold transition-all shadow-md hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0a4 4 0 01-8 0m8 0v2a2 2 0 01-2 2h-4a2 2 0 01-2-2V7"
            />
          </svg>
          Quiz Section
        </Link>
      </div>
      <h1 className="text-4xl font-bold font-league-spartan text-eerie-black-1 mb-8">
        Manage Categories
      </h1>

      {/* Add Category Form */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-12">
        <h2 className="text-2xl font-bold text-eerie-black-2 mb-6">
          Add New Categories
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                htmlFor="order"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Display Order
              </label>
              <input
                type="number"
                name="order"
                id="order"
                value={newCategory.order}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-selective-yellow focus:border-selective-yellow"
                placeholder="1"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-2">
                Lower numbers appear first. Leave empty for auto-assignment.
              </p>
            </div>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-eerie-black-2">
            Existing Categories
          </h2>
          <button
            onClick={handleUpdateOrder}
            disabled={isUpdatingOrder}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingOrder ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiSave />
            )}
            <span>{isUpdatingOrder ? "Saving..." : "Save Order"}</span>
          </button>
        </div>

        {orderUpdateSuccess && (
          <div className="flex items-center gap-2 text-green-600 mb-4 p-3 bg-green-100 rounded-lg">
            <FiCheckCircle />
            <span>{orderUpdateSuccess}</span>
          </div>
        )}

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
          <div className="space-y-2">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={category._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg transition-shadow hover:shadow-md cursor-move border-l-4 border-transparent hover:border-selective-yellow"
                >
                  <div className="flex items-center gap-4 flex-grow">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiMove size={16} />
                      <span className="text-sm font-mono">{index + 1}</span>
                    </div>

                    <div className="flex-grow">
                      <Link
                        to={`/categories/${category._id}/tutorials`}
                        className="group"
                      >
                        <p className="font-bold text-lg text-eerie-black-2 group-hover:text-selective-yellow transition-colors">
                          {category.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {category.path} - Created:{" "}
                          {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Order:
                      </label>
                      <input
                        type="number"
                        value={category.order || index + 1}
                        onChange={(e) =>
                          handleOrderChange(category._id, e.target.value)
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        min="0"
                      />
                    </div>

                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                      aria-label="Delete category"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
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
