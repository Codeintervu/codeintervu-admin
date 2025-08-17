import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import {
  FiSave,
  FiArrowLeft,
  FiPlus,
  FiX,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiChevronDown,
} from "react-icons/fi";

const AddInterviewQuestion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState({
    category: "",
    question: "",
    answer: "",
    difficulty: "Medium",
    tags: [],
    isActive: true,
    order: 0,
  });

  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#10B981",
  });
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const categoryDropdownRef = useRef(null);

  const difficulties = [
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" },
  ];

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle clicks outside the category dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryDropdownOpen(false);
        setCategorySearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/interview-question-categories");
      const categoriesData = response.data.data;

      // Add "Select Category" and "Add New Category" options
      const allCategories = [
        { value: "", label: "Select Category" },
        { value: "add-new", label: "➕ Add New Category" },
        ...categoriesData.map((cat) => ({
          value: cat.slug,
          label: cat.name,
        })),
      ];

      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to only Java category
      setCategories([
        { value: "", label: "Select Category" },
        { value: "add-new", label: "➕ Add New Category" },
        { value: "java", label: "Java" },
      ]);
    }
  };

  const handleInputChange = (field, value) => {
    setQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If "Add New Category" is selected, show the modal
    if (field === "category" && value === "add-new") {
      setShowAddCategoryModal(true);
      // Reset the category selection
      setQuestion((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !question.tags.includes(newTag.trim())) {
      setQuestion((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setQuestion((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCategoryInputChange = (field, value) => {
    setNewCategory((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from name
    if (field === "name" && !newCategory.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setNewCategory((prev) => ({ ...prev, slug }));
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      toast.error("Please fill in the category name and slug");
      return;
    }

    setCategoryLoading(true);
    try {
      const response = await api.post(
        "/interview-question-categories/admin",
        newCategory
      );

      // Add the new category to the list
      const newCategoryOption = {
        value: response.data.data.slug,
        label: response.data.data.name,
      };

      setCategories((prev) => [
        prev[0], // "Select Category"
        prev[1], // "Add New Category"
        ...prev.slice(2), // Existing categories
        newCategoryOption, // New category at the end
      ]);

      // Select the new category
      setQuestion((prev) => ({
        ...prev,
        category: newCategoryOption.value,
      }));

      // Close modal and reset form
      setShowAddCategoryModal(false);
      setNewCategory({
        name: "",
        slug: "",
        description: "",
        color: "#10B981",
      });

      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create category. Please try again.");
      }
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (categorySlug) => {
    if (!categorySlug || categorySlug === "add-new") return;

    // Prevent deletion of hardcoded categories
    const hardcodedCategories = ["java"];
    if (hardcodedCategories.includes(categorySlug)) {
      toast.error(
        "Cannot delete hardcoded categories. Please create custom categories instead."
      );
      return;
    }

    const confirmed = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex items-center gap-2">
            <span>Are you sure you want to delete this category?</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
        }
      );
    });

    if (!confirmed) return;

    try {
      // Find the category ID from the slug
      const response = await api.get("/interview-question-categories");
      const categoriesData = response.data.data;
      const categoryToDelete = categoriesData.find(
        (cat) => cat.slug === categorySlug
      );

      if (!categoryToDelete) {
        toast.error(
          "Category not found or is a hardcoded category that cannot be deleted."
        );
        return;
      }

      // Delete the category
      await api.delete(
        `/interview-question-categories/admin/${categoryToDelete._id}`
      );

      // Remove from local state
      setCategories((prev) => prev.filter((cat) => cat.value !== categorySlug));

      // If the deleted category was selected, reset to empty
      if (question.category === categorySlug) {
        setQuestion((prev) => ({
          ...prev,
          category: "",
        }));
      }

      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete category. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/interview-questions/admin", question);
      navigate("/interview-questions");
    } catch (error) {
      console.error("Error creating question:", error);
      if (error.response?.data?.errors) {
        toast.error(
          `Validation errors: ${error.response.data.errors.join(", ")}`
        );
      } else {
        toast.error("Failed to create question. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
  ];

  return (
    <div>
      <Toaster position="top-right" />
      <AdminNavbar />
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/interview-questions"
              className="text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Question
              </h1>
              <p className="text-gray-600 mt-1">
                Create a new interview question with all details
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Question Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative" ref={categoryDropdownRef}>
                  <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent cursor-pointer bg-white"
                    onClick={() =>
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          question.category ? "text-gray-900" : "text-gray-500"
                        }
                      >
                        {question.category
                          ? categories.find(
                              (cat) => cat.value === question.category
                            )?.label || "Select Category"
                          : "Select Category"}
                      </span>
                      <FiChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isCategoryDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isCategoryDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {/* Search input */}
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Search categories..."
                          value={categorySearchTerm}
                          onChange={(e) =>
                            setCategorySearchTerm(e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Categories list */}
                      <div className="py-1">
                        {categories
                          .filter((category) =>
                            category.label
                              .toLowerCase()
                              .includes(categorySearchTerm.toLowerCase())
                          )
                          .map((category) => (
                            <div
                              key={category.value}
                              className={`flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                                question.category === category.value
                                  ? "bg-teal-50 text-teal-700"
                                  : ""
                              }`}
                              onClick={() => {
                                if (category.value === "add-new") {
                                  setShowAddCategoryModal(true);
                                  setIsCategoryDropdownOpen(false);
                                } else {
                                  handleInputChange("category", category.value);
                                  setIsCategoryDropdownOpen(false);
                                  setCategorySearchTerm("");
                                }
                              }}
                            >
                              <span className="flex-1">{category.label}</span>
                              {category.value &&
                                category.value !== "add-new" &&
                                category.value !== "java" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCategory(category.value);
                                    }}
                                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                                    title="Delete category"
                                  >
                                    <FiTrash2 className="w-3 h-3" />
                                  </button>
                                )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hidden input for form validation */}
                <input type="hidden" value={question.category} required />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  value={question.difficulty}
                  onChange={(e) =>
                    handleInputChange("difficulty", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={question.order}
                  onChange={(e) =>
                    handleInputChange("order", parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Lower numbers appear first (0 = highest priority)
                </p>
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={question.isActive === true}
                      onChange={(e) =>
                        handleInputChange("isActive", e.target.value === "true")
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={question.isActive === false}
                      onChange={(e) =>
                        handleInputChange("isActive", e.target.value === "true")
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                value={question.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
                placeholder="Enter the interview question..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {question.question.length}/1000 characters
              </p>
            </div>

            {/* Answer */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer *
              </label>
              <textarea
                value={question.answer}
                onChange={(e) => handleInputChange("answer", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={6}
                placeholder="Provide a detailed answer..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {question.answer.length}/2000 characters
              </p>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-teal-600 hover:text-teal-800"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              {loading ? "Creating..." : "Create Question"}
            </button>
            <Link
              to="/interview-questions"
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New Category
                </h3>
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      handleCategoryInputChange("name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., TypeScript, Vue.js"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) =>
                      handleCategoryInputChange("slug", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., typescript, vuejs"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) =>
                      handleCategoryInputChange("description", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={2}
                    placeholder="Brief description..."
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {colorOptions.slice(0, 10).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          handleCategoryInputChange("color", color)
                        }
                        className={`w-8 h-8 rounded border-2 ${
                          newCategory.color === color
                            ? "border-gray-900"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {newCategory.name || "Category Name"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={
                    categoryLoading || !newCategory.name || !newCategory.slug
                  }
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {categoryLoading ? "Creating..." : "Create Category"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddInterviewQuestion;
