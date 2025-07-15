import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

const QuizCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await api.get("/quiz/categories");
    setCategories(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post("/quiz/categories", { name: newName, description: newDesc });
    setNewName("");
    setNewDesc("");
    setShowAdd(false);
    fetchCategories();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Quiz Categories</h1>
        <div className="flex gap-4">
          <Link
            to="/categories"
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
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
            Course Categories
          </Link>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowAdd((v) => !v)}
          >
            + Add Category
          </button>
        </div>
      </div>
      {showAdd && (
        <form className="mb-8 flex gap-4" onSubmit={handleAdd}>
          <input
            className="border px-2 py-1 rounded"
            placeholder="Category Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <input
            className="border px-2 py-1 rounded"
            placeholder="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded"
            type="submit"
          >
            Save
          </button>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-teal-100 rounded-lg shadow p-6 flex flex-col items-center"
            >
              <h2 className="text-xl font-bold mb-2">{cat.name}</h2>
              <p className="mb-4 text-center text-gray-700">
                {cat.description}
              </p>
              {/* TODO: Show question count here */}
              <Link
                to={`/quiz/${cat._id}`}
                className="bg-green-600 text-white px-4 py-2 rounded mt-2"
              >
                Manage MCQs
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizCategories;
