import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./AdminLayout"; // This will be created next
import Categories from "./pages/Categories";
import ManageCategoryTutorials from "./pages/ManageCategoryTutorials";
import ManageTutorialSections from "./pages/ManageTutorialSections";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/categories" replace />} />
          <Route path="categories" element={<Categories />} />
          <Route
            path="categories/:categoryId/tutorials"
            element={<ManageCategoryTutorials />}
          />
          <Route
            path="tutorials/:tutorialId/sections"
            element={<ManageTutorialSections />}
          />
          {/* The old /tutorials route can be removed or redirected if desired */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
