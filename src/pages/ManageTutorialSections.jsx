import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import {
  FiPlus,
  FiTrash2,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowLeft,
  FiYoutube,
  FiImage,
  FiEdit,
  FiXCircle,
} from "react-icons/fi";

const ManageTutorialSections = () => {
  const { tutorialId } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialCompilerState = {
    enabled: false,
    language: "java",
    boilerplate: "",
    editable: true,
  };
  const initialFormState = {
    heading: "",
    contentBlocks: [
      {
        subheading: "",
        content: "",
        media: null,
        compiler: { ...initialCompilerState },
      },
    ],
    youtubeUrl: "",
    media: null,
  };

  const [newSection, setNewSection] = useState(initialFormState);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Compiler state
  const [compilerEnabled, setCompilerEnabled] = useState(false);
  const [compilerLanguage, setCompilerLanguage] = useState("java");
  const [compilerBoilerplate, setCompilerBoilerplate] = useState("");
  const [compilerEditable, setCompilerEditable] = useState(true);

  const fetchTutorialDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/tutorials/${tutorialId}`);
      setTutorial(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch tutorial details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorialDetails();
  }, [tutorialId]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setNewSection({ ...newSection, media: files[0] });
    } else {
      setNewSection({ ...newSection, [name]: value });
    }
  };

  const handleContentBlockChange = (index, e) => {
    const { name, value, files, type, checked } = e.target;
    const updatedBlocks = [...newSection.contentBlocks];
    if (name.startsWith("compiler.")) {
      const key = name.split(".")[1];
      updatedBlocks[index].compiler = {
        ...updatedBlocks[index].compiler,
        [key]: type === "checkbox" ? checked : value,
      };
    } else if (name === "media") {
      updatedBlocks[index] = { ...updatedBlocks[index], media: files[0] };
    } else if (name === "syntaxEnabled") {
      updatedBlocks[index] = {
        ...updatedBlocks[index],
        syntaxEnabled: checked,
      };
    } else if (name === "syntax") {
      updatedBlocks[index] = { ...updatedBlocks[index], syntax: value };
    } else {
      updatedBlocks[index] = { ...updatedBlocks[index], [name]: value };
    }
    setNewSection({ ...newSection, contentBlocks: updatedBlocks });
  };

  const addContentBlock = () => {
    setNewSection({
      ...newSection,
      contentBlocks: [
        ...newSection.contentBlocks,
        {
          subheading: "",
          content: "",
          media: null,
          compiler: { ...initialCompilerState },
        },
      ],
    });
  };

  const removeContentBlock = (index) => {
    const updatedBlocks = [...newSection.contentBlocks];
    updatedBlocks.splice(index, 1);
    setNewSection({ ...newSection, contentBlocks: updatedBlocks });
  };

  const handleEditClick = (section) => {
    setEditingSectionId(section._id);
    let blocks = [];
    if (section.contentBlocks && section.contentBlocks.length > 0) {
      blocks = section.contentBlocks;
    } else if (section.subheading || section.content) {
      blocks = [
        {
          subheading: section.subheading || "",
          content: section.content || "",
          compiler: { ...initialCompilerState },
        },
      ];
    } else {
      blocks = [
        {
          subheading: "",
          content: "",
          media: null,
          compiler: { ...initialCompilerState },
        },
      ];
    }
    setNewSection({
      heading: section.heading,
      contentBlocks: blocks.map((b) => ({
        ...b,
        media: null,
        compiler: b.compiler || { ...initialCompilerState },
      })),
      youtubeUrl: section.youtubeUrl || "",
      media: null,
    });
    setSubmitSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingSectionId(null);
    setNewSection(initialFormState);
    setCompilerEnabled(false);
    setCompilerLanguage("java");
    setCompilerBoilerplate("");
    setCompilerEditable(true);
    document.getElementById("media-input").value = "";
    setSubmitSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    const formData = new FormData();
    formData.append("heading", newSection.heading);
    formData.append("youtubeUrl", newSection.youtubeUrl);
    const fileIndexes = {};
    let contentBlockFileCounter = 0;
    newSection.contentBlocks.forEach((block, index) => {
      if (block.media) {
        formData.append("contentBlockMedia", block.media);
        fileIndexes[index] = contentBlockFileCounter++;
      }
    });
    const blocksForUpload = newSection.contentBlocks.map((block, index) => ({
      _id: block._id,
      subheading: block.subheading,
      content: block.content,
      fileIndex: fileIndexes[index],
      compiler: block.compiler || { ...initialCompilerState },
      syntaxEnabled: block.syntaxEnabled || false,
      syntax: block.syntax || "",
    }));
    formData.append("contentBlocks", JSON.stringify(blocksForUpload));
    if (newSection.media) {
      formData.append("mainMedia", newSection.media);
    }
    try {
      if (editingSectionId) {
        await api.put(
          `/tutorials/${tutorialId}/sections/${editingSectionId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setSubmitSuccess("Section updated successfully!");
      } else {
        await api.post(`/tutorials/${tutorialId}/sections`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSubmitSuccess("Section added successfully!");
      }
      cancelEdit();
      fetchTutorialDetails();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Operation failed.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitSuccess(null);
        setSubmitError(null);
      }, 5000);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        await api.delete(`/tutorials/${tutorialId}/sections/${sectionId}`);
        fetchTutorialDetails(); // Refresh sections
      } catch (err) {
        alert("Failed to delete section.");
      }
    }
  };

  if (loading)
    return (
      <div className="p-16 flex justify-center">
        <FiLoader className="animate-spin text-4xl" />
      </div>
    );
  if (error)
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;

  return (
    <div>
      <Link
        to={`/categories/${tutorial?.category?._id}/tutorials`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-eerie-black-1 mb-6"
      >
        <FiArrowLeft />
        <span>Back to Tutorials for {tutorial?.category?.name}</span>
      </Link>
      <h1 className="text-4xl font-bold font-league-spartan text-eerie-black-1 mb-2">
        Manage Sections for{" "}
        <span className="text-selective-yellow">{tutorial?.title}</span>
      </h1>
      <p className="text-gray-500 mb-8">
        Add, edit, or remove content sections for this tutorial.
      </p>

      {/* Add/Edit Section Form */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-eerie-black-2">
            {editingSectionId ? "Edit Section" : "Add New Section"}
          </h2>
          {editingSectionId && (
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
            >
              <FiXCircle />
              Cancel Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="heading"
            value={newSection.heading}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border-b-2"
            placeholder="Section Heading (e.g., What is Java?)"
            required
          />

          {newSection.contentBlocks.map((block, index) => (
            <div
              key={index}
              className="space-y-4 border p-4 rounded-lg relative"
            >
              <input
                name="subheading"
                value={block.subheading}
                onChange={(e) => handleContentBlockChange(index, e)}
                className="w-full px-4 py-2 border-b-2"
                placeholder="Subheading (optional)"
              />
              {/* Block type selector */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Block Type
                </label>
                <select
                  name="blockType"
                  value={block.blockType || "text"}
                  onChange={(e) => {
                    const updatedBlocks = [...newSection.contentBlocks];
                    updatedBlocks[index].blockType = e.target.value;
                    // Reset content for new type
                    if (e.target.value === "table") {
                      updatedBlocks[index].tableRows = 2;
                      updatedBlocks[index].tableCols = 2;
                      updatedBlocks[index].tableData = Array(2)
                        .fill()
                        .map(() => Array(2).fill(""));
                      updatedBlocks[index].content = "";
                    } else {
                      updatedBlocks[index].content = "";
                    }
                    setNewSection({
                      ...newSection,
                      contentBlocks: updatedBlocks,
                    });
                  }}
                  className="w-32 border rounded px-2 py-1"
                >
                  <option value="text">Text</option>
                  <option value="table">Table</option>
                </select>
              </div>
              {/* Content input for text block */}
              {(!block.blockType || block.blockType === "text") && (
                <div className="my-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={block.content}
                    onChange={(e) => handleContentBlockChange(index, e)}
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter text content..."
                  />
                </div>
              )}
              {/* Table input for table block */}
              {block.blockType === "table" && (
                <div className="my-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table
                  </label>
                  <div className="flex gap-4 mb-2">
                    <div>
                      <label className="text-xs">Rows</label>
                      <input
                        type="number"
                        min={1}
                        value={block.tableRows || 2}
                        onChange={(e) => {
                          const rows = parseInt(e.target.value, 10) || 1;
                          const updatedBlocks = [...newSection.contentBlocks];
                          updatedBlocks[index].tableRows = rows;
                          // Adjust tableData size
                          let data =
                            block.tableData ||
                            Array(2)
                              .fill()
                              .map(() => Array(block.tableCols || 2).fill(""));
                          if (data.length < rows) {
                            data = [
                              ...data,
                              ...Array(rows - data.length)
                                .fill()
                                .map(() =>
                                  Array(block.tableCols || 2).fill("")
                                ),
                            ];
                          } else if (data.length > rows) {
                            data = data.slice(0, rows);
                          }
                          updatedBlocks[index].tableData = data;
                          setNewSection({
                            ...newSection,
                            contentBlocks: updatedBlocks,
                          });
                        }}
                        className="w-16 border rounded px-2 py-1 ml-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Columns</label>
                      <input
                        type="number"
                        min={1}
                        value={block.tableCols || 2}
                        onChange={(e) => {
                          const cols = parseInt(e.target.value, 10) || 1;
                          const updatedBlocks = [...newSection.contentBlocks];
                          updatedBlocks[index].tableCols = cols;
                          // Adjust tableData size
                          let data =
                            block.tableData ||
                            Array(block.tableRows || 2)
                              .fill()
                              .map(() => Array(2).fill(""));
                          data = data.map((row) => {
                            if (row.length < cols) {
                              return [
                                ...row,
                                ...Array(cols - row.length).fill(""),
                              ];
                            } else if (row.length > cols) {
                              return row.slice(0, cols);
                            }
                            return row;
                          });
                          updatedBlocks[index].tableData = data;
                          setNewSection({
                            ...newSection,
                            contentBlocks: updatedBlocks,
                          });
                        }}
                        className="w-16 border rounded px-2 py-1 ml-2"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={block.tableHeader || false}
                      onChange={(e) => {
                        const updatedBlocks = [...newSection.contentBlocks];
                        updatedBlocks[index].tableHeader = e.target.checked;
                        setNewSection({
                          ...newSection,
                          contentBlocks: updatedBlocks,
                        });
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-sm">First row is header</span>
                  </label>
                  <table className="border border-gray-400 w-full mb-2">
                    <tbody>
                      {(block.tableData || []).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) =>
                            rIdx === 0 && block.tableHeader ? (
                              <th
                                key={cIdx}
                                className="border border-gray-400 p-1 font-bold text-lg bg-gray-100"
                              >
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) => {
                                    const updatedBlocks = [
                                      ...newSection.contentBlocks,
                                    ];
                                    const data = updatedBlocks[
                                      index
                                    ].tableData.map((arr) => [...arr]);
                                    data[rIdx][cIdx] = e.target.value;
                                    updatedBlocks[index].tableData = data;
                                    setNewSection({
                                      ...newSection,
                                      contentBlocks: updatedBlocks,
                                    });
                                  }}
                                  className="w-full border rounded px-1 py-0.5 font-bold text-lg bg-gray-100"
                                />
                              </th>
                            ) : (
                              <td
                                key={cIdx}
                                className="border border-gray-400 p-1"
                              >
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) => {
                                    const updatedBlocks = [
                                      ...newSection.contentBlocks,
                                    ];
                                    const data = updatedBlocks[
                                      index
                                    ].tableData.map((arr) => [...arr]);
                                    data[rIdx][cIdx] = e.target.value;
                                    updatedBlocks[index].tableData = data;
                                    setNewSection({
                                      ...newSection,
                                      contentBlocks: updatedBlocks,
                                    });
                                  }}
                                  className="w-full border rounded px-1 py-0.5"
                                />
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() => {
                      // Save table as HTML in content
                      let html = "";
                      if (block.tableHeader) {
                        html =
                          `<table class="custom-table">` +
                          `<thead><tr>${(block.tableData[0] || [])
                            .map(
                              (cell) =>
                                `<th class="custom-table-th">${cell}</th>`
                            )
                            .join("")}</tr></thead>` +
                          `<tbody>${(block.tableData.slice(1) || [])
                            .map(
                              (row) =>
                                `<tr>${row
                                  .map(
                                    (cell) =>
                                      `<td class="custom-table-td">${cell}</td>`
                                  )
                                  .join("")}</tr>`
                            )
                            .join("")}</tbody></table>`;
                      } else {
                        html =
                          `<table class="custom-table">` +
                          `<tbody>${(block.tableData || [])
                            .map(
                              (row) =>
                                `<tr>${row
                                  .map(
                                    (cell) =>
                                      `<td class="custom-table-td">${cell}</td>`
                                  )
                                  .join("")}</tr>`
                            )
                            .join("")}</tbody></table>`;
                      }
                      const updatedBlocks = [...newSection.contentBlocks];
                      updatedBlocks[index].content = html;
                      setNewSection({
                        ...newSection,
                        contentBlocks: updatedBlocks,
                      });
                    }}
                  >
                    Save Table
                  </button>
                  {block.content && (
                    <div className="mt-2 text-xs text-green-700">
                      Table saved!
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <FiImage className="text-gray-400" size={20} />
                <label className="block text-sm font-medium text-gray-700">
                  Sub-section Media
                </label>
              </div>
              <input
                type="file"
                name="media"
                onChange={(e) => handleContentBlockChange(index, e)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {/* Per-block compiler controls */}
              <div className="border p-3 rounded-lg bg-gray-50 mt-2">
                <label className="flex items-center gap-2 font-medium mb-2">
                  <input
                    type="checkbox"
                    name="compiler.enabled"
                    checked={block.compiler?.enabled || false}
                    onChange={(e) => handleContentBlockChange(index, e)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  Enable Compiler for this sub-section
                </label>
                {block.compiler?.enabled && (
                  <div className="space-y-2 mt-2">
                    <label className="block font-medium">
                      Language:
                      <select
                        name="compiler.language"
                        value={block.compiler.language}
                        onChange={(e) => handleContentBlockChange(index, e)}
                        className="ml-2 border rounded px-2 py-1"
                      >
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                      </select>
                    </label>
                    <label className="block font-medium">
                      Boilerplate Code:
                      <textarea
                        name="compiler.boilerplate"
                        value={block.compiler.boilerplate}
                        onChange={(e) => handleContentBlockChange(index, e)}
                        rows={4}
                        className="w-full mt-1 border rounded px-2 py-1 font-mono text-sm"
                        placeholder="Enter default code for the compiler..."
                      />
                    </label>
                    <label className="flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        name="compiler.editable"
                        checked={block.compiler.editable}
                        onChange={(e) => handleContentBlockChange(index, e)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      Allow user to modify code
                    </label>
                  </div>
                )}
                {/* Syntax Highlighter Option */}
                <label className="flex items-center gap-2 font-medium mt-4">
                  <input
                    type="checkbox"
                    name="syntaxEnabled"
                    checked={block.syntaxEnabled || false}
                    onChange={(e) => handleContentBlockChange(index, e)}
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  Enable Syntax Highlighter for this sub-section
                </label>
                {block.syntaxEnabled && (
                  <div>
                    <textarea
                      name="syntax"
                      value={block.syntax || ""}
                      onChange={(e) => handleContentBlockChange(index, e)}
                      rows={3}
                      className="w-full mt-2 border rounded px-2 py-1 font-mono text-sm bg-gray-900 text-white"
                      placeholder="Paste your syntax/code here..."
                    />
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-yellow-600 text-black rounded font-bold hover:bg-yellow-700 transition"
                      onClick={() => {
                        const updatedBlocks = [...newSection.contentBlocks];
                        updatedBlocks[index].syntaxSaved = true;
                        setNewSection({
                          ...newSection,
                          contentBlocks: updatedBlocks,
                        });
                        setTimeout(() => {
                          const resetBlocks = [...newSection.contentBlocks];
                          resetBlocks[index].syntaxSaved = false;
                          setNewSection({
                            ...newSection,
                            contentBlocks: resetBlocks,
                          });
                        }, 1500);
                      }}
                    >
                      Save
                    </button>
                    {block.syntaxSaved && (
                      <span className="ml-4 text-green-600 font-semibold">
                        Syntax highlighted!
                      </span>
                    )}
                  </div>
                )}
              </div>
              {newSection.contentBlocks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContentBlock(index)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addContentBlock}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <FiPlus /> Add Content Block
          </button>

          <div className="flex items-center gap-2">
            <FiYoutube className="text-red-500" size={24} />
            <input
              name="youtubeUrl"
              value={newSection.youtubeUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-b-2"
              placeholder="YouTube Video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiImage className="text-blue-500" size={24} />
            <label
              htmlFor="media-input"
              className="block text-sm font-medium text-gray-700"
            >
              Main Media (for the whole section)
            </label>
          </div>
          <input
            type="file"
            name="media"
            id="media-input"
            onChange={handleInputChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-selective-yellow file:text-eerie-black-1 hover:file:bg-yellow-500"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-selective-yellow text-eerie-black-1 px-5 py-3 rounded-lg hover:bg-yellow-500 font-bold transition-all shadow-md"
          >
            {isSubmitting ? (
              <FiLoader className="animate-spin" />
            ) : editingSectionId ? (
              <FiEdit />
            ) : (
              <FiPlus />
            )}
            <span>
              {isSubmitting
                ? "Saving..."
                : editingSectionId
                ? "Update Section"
                : "Add Section"}
            </span>
          </button>
          {submitSuccess && (
            <div className="text-green-600 flex items-center gap-2">
              <FiCheckCircle />
              <span>{submitSuccess}</span>
            </div>
          )}
          {submitError && (
            <div className="text-red-600 flex items-center gap-2">
              <FiAlertTriangle />
              <span>{submitError}</span>
            </div>
          )}
        </form>
      </div>

      {/* Existing Sections List */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-eerie-black-2 mb-6">
          Existing Sections ({tutorial?.sections?.length || 0})
        </h2>
        <div className="space-y-4">
          {tutorial?.sections?.length > 0 ? (
            tutorial.sections.map((section, index) => (
              <div
                key={section._id || index}
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold text-lg text-eerie-black-2">
                    {section.heading}
                  </h3>
                  {/* Simplified display for admin panel */}
                  <p className="mt-2 text-sm text-gray-500 italic">
                    {section.contentBlocks?.length > 0
                      ? `${section.contentBlocks.length} content block(s)`
                      : "No text content..."}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    {section.mediaUrl && (
                      <FiImage
                        title={section.mediaUrl}
                        className="text-blue-500"
                      />
                    )}
                    {section.youtubeUrl && (
                      <FiYoutube
                        title={section.youtubeUrl}
                        className="text-red-500"
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(section)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              This tutorial has no sections yet. Add one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTutorialSections;
