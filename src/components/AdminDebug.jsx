import React, { useState } from "react";
import api from "../utils/api";

const AdminDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const runDebugTests = async () => {
    setLoading(true);
    const info = {};

    try {
      // Test 1: Check if admin token exists
      const adminToken = localStorage.getItem("adminToken");
      info.adminToken = adminToken ? "Present" : "Missing";
      info.tokenLength = adminToken ? adminToken.length : 0;

      // Test 2: Check API base URL
      info.baseURL = api.defaults.baseURL;

      // Test 3: Test categories endpoint (public)
      try {
        const categoriesRes = await api.get("/categories");
        info.categoriesStatus = "Success";
        info.categoriesCount = categoriesRes.data.length;
        if (categoriesRes.data.length > 0) {
          info.testCategoryId = categoriesRes.data[0]._id;
        }
      } catch (error) {
        info.categoriesStatus = `Error: ${error.response?.status}`;
        info.categoriesError = error.response?.data;
      }

      // Test 4: Test admin stats endpoint (protected)
      try {
        const statsRes = await api.get("/admin/stats");
        info.adminStatsStatus = "Success";
        info.adminStats = statsRes.data;
      } catch (error) {
        info.adminStatsStatus = `Error: ${error.response?.status}`;
        info.adminStatsError = error.response?.data;
      }

      // Test 5: Test ad endpoint if we have a category
      if (info.testCategoryId) {
        try {
          const adRes = await api.get(`/categories/${info.testCategoryId}/ad`);
          info.adStatus = "Success";
          info.adData = adRes.data;
        } catch (error) {
          info.adStatus = `Error: ${error.response?.status}`;
          info.adError = error.response?.data;
        }
      }
    } catch (error) {
      info.generalError = error.message;
    }

    setDebugInfo(info);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Admin Debug Panel</h3>

      <button
        onClick={runDebugTests}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Running Tests..." : "Run Debug Tests"}
      </button>

      {Object.keys(debugInfo).length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Debug Results:</h4>
          <pre className="bg-white p-4 rounded border text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AdminDebug;

