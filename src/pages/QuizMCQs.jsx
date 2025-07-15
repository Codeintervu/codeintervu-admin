import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const QuizMCQs = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [hint, setHint] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editOptions, setEditOptions] = useState(["", ""]);
  const [editCorrectOption, setEditCorrectOption] = useState(0);
  const [editHint, setEditHint] = useState("");

  useEffect(() => {
    fetchCategory();
    fetchMCQs();
  }, [id]);

  const fetchCategory = async () => {
    const { data } = await api.get(`/quiz/categories`);
    setCategory(data.find((c) => c._id === id));
  };

  const fetchMCQs = async () => {
    setLoading(true);
    const { data } = await api.get(`/quiz/categories/${id}/questions`);
    setMcqs(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post(`/quiz/categories/${id}/questions`, {
      question,
      options,
      correctOption: Number(correctOption),
      hint,
    });
    setQuestion("");
    setOptions(["", ""]);
    setCorrectOption(0);
    setHint("");
    setShowAdd(false);
    fetchMCQs();
  };

  const handleEdit = (mcq) => {
    setEditId(mcq._id);
    setEditQuestion(mcq.question);
    setEditOptions([...mcq.options]);
    setEditCorrectOption(mcq.correctOption);
    setEditHint(mcq.hint || "");
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    await api.put(`/quiz/questions/${editId}`, {
      question: editQuestion,
      options: editOptions,
      correctOption: Number(editCorrectOption),
      hint: editHint,
    });
    setEditId(null);
    setEditQuestion("");
    setEditOptions(["", ""]);
    setEditCorrectOption(0);
    setEditHint("");
    fetchMCQs();
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditQuestion("");
    setEditOptions(["", ""]);
    setEditCorrectOption(0);
    setEditHint("");
  };

  const handleDelete = async (qid) => {
    await api.delete(`/quiz/questions/${qid}`);
    fetchMCQs();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">MCQs for {category?.name}</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
        onClick={() => setShowAdd((v) => !v)}
      >
        + Add MCQ
      </button>
      {showAdd && (
        <form className="mb-8" onSubmit={handleAdd}>
          <textarea
            className="border px-2 py-1 rounded w-full mb-2"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            rows={3}
          />
          <input
            className="border px-2 py-1 rounded w-full mb-2"
            placeholder="Hint (optional)"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
          />
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <textarea
                className="border px-2 py-1 rounded flex-1"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[idx] = e.target.value;
                  setOptions(newOpts);
                }}
                required
                rows={2}
              />
              <input
                type="radio"
                name="correctOption"
                checked={correctOption === idx}
                onChange={() => setCorrectOption(idx)}
              />
              <span>Correct</span>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() =>
                    setOptions(options.filter((_, i) => i !== idx))
                  }
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 text-white px-2 py-1 rounded mb-2"
            onClick={() => setOptions([...options, ""])}
          >
            + Add Option
          </button>
          <br />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            type="submit"
          >
            Save MCQ
          </button>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {mcqs.map((mcq, idx) => (
            <div key={mcq._id} className="bg-white rounded shadow p-4">
              {editId === mcq._id ? (
                <form onSubmit={handleEditSave} className="mb-2">
                  <textarea
                    className="border px-2 py-1 rounded w-full mb-2"
                    placeholder="Question"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                    required
                    rows={3}
                  />
                  <input
                    className="border px-2 py-1 rounded w-full mb-2"
                    placeholder="Hint (optional)"
                    value={editHint}
                    onChange={(e) => setEditHint(e.target.value)}
                  />
                  {editOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <textarea
                        className="border px-2 py-1 rounded flex-1"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...editOptions];
                          newOpts[i] = e.target.value;
                          setEditOptions(newOpts);
                        }}
                        required
                        rows={2}
                      />
                      <input
                        type="radio"
                        name="editCorrectOption"
                        checked={editCorrectOption === i}
                        onChange={() => setEditCorrectOption(i)}
                      />
                      <span>Correct</span>
                      {editOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditOptions(
                              editOptions.filter((_, j) => j !== i)
                            )
                          }
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded mb-2"
                    onClick={() => setEditOptions([...editOptions, ""])}
                  >
                    + Add Option
                  </button>
                  <br />
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded mt-2 mr-2"
                    type="submit"
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded mt-2"
                    type="button"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="font-semibold mb-2">
                    {idx + 1}. {mcq.question}
                  </div>
                  {mcq.hint && (
                    <div className="mb-2 text-blue-600 text-sm">
                      Hint: {mcq.hint}
                    </div>
                  )}
                  <ul className="mb-2">
                    {mcq.options.map((opt, i) => (
                      <li
                        key={i}
                        className={
                          i === mcq.correctOption
                            ? "font-bold text-green-600"
                            : ""
                        }
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleEdit(mcq)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(mcq._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizMCQs;
