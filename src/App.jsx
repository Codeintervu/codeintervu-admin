import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import QuizCategories from "./pages/QuizCategories";
import QuizMCQs from "./pages/QuizMCQs";
import Projects from "./pages/Projects";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import ProjectDetails from "./pages/ProjectDetails";
import InterviewQuestions from "./pages/InterviewQuestions";
import AddInterviewQuestion from "./pages/AddInterviewQuestion";
import EditInterviewQuestion from "./pages/EditInterviewQuestion";
import Users from "./pages/Users";

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
          <Route index element={<Dashboard />} />

          {/* Categories */}
          <Route path="categories" element={<Categories />} />

          {/* Quiz Management */}
          <Route path="quiz" element={<QuizCategories />} />
          <Route path="quiz/:id" element={<QuizMCQs />} />

          {/* Projects Management */}
          <Route path="projects" element={<Projects />} />
          <Route path="projects/add" element={<AddProject />} />
          <Route path="projects/:id/edit" element={<EditProject />} />
          <Route path="projects/:id" element={<ProjectDetails />} />

          {/* Interview Questions Management */}
          <Route path="interview-questions" element={<InterviewQuestions />} />
          <Route
            path="interview-questions/add"
            element={<AddInterviewQuestion />}
          />
          <Route
            path="interview-questions/:id/edit"
            element={<EditInterviewQuestion />}
          />

          {/* Mock Interviews Management */}
          <Route
            path="mock-interviews"
            element={<div>Mock Interviews - Coming Soon</div>}
          />
          <Route
            path="mock-interviews/:id"
            element={<div>Interview Details - Coming Soon</div>}
          />

          {/* Coding Problems Management */}
          <Route
            path="coding-problems"
            element={<div>Coding Problems - Coming Soon</div>}
          />
          <Route
            path="coding-problems/:id"
            element={<div>Problem Details - Coming Soon</div>}
          />

          {/* Whiteboard Management */}
          <Route
            path="whiteboard"
            element={<div>Whiteboard Sessions - Coming Soon</div>}
          />
          <Route
            path="whiteboard/:id"
            element={<div>Session Details - Coming Soon</div>}
          />

          {/* Blog Management */}
          <Route path="blog" element={<div>Blog Posts - Coming Soon</div>} />
          <Route
            path="blog/:id"
            element={<div>Post Details - Coming Soon</div>}
          />

          {/* Contact Messages */}
          <Route
            path="contact"
            element={<div>Contact Messages - Coming Soon</div>}
          />
          <Route
            path="contact/:id"
            element={<div>Message Details - Coming Soon</div>}
          />

          {/* User Management */}
          <Route path="users" element={<Users />} />
          <Route
            path="users/:id"
            element={<div>User Details - Coming Soon</div>}
          />

          {/* Payment Management */}
          <Route
            path="payments"
            element={<div>Payment Management - Coming Soon</div>}
          />
          <Route
            path="payments/:id"
            element={<div>Payment Details - Coming Soon</div>}
          />

          {/* Analytics */}
          <Route
            path="analytics"
            element={<div>Analytics Dashboard - Coming Soon</div>}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<div>Site Settings - Coming Soon</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
