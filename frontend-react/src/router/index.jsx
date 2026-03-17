import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Public Pages
import HomePage from '../pages/public/HomePage';

// Admin Pages
import LoginPage from '../pages/admin/LoginPage';
import Dashboard from '../pages/admin/Dashboard';
import ProjectsPage from '../pages/admin/ProjectsPage';
import SkillsPage from '../pages/admin/SkillsPage';
import ExperiencesPage from '../pages/admin/ExperiencesPage';
import MessagesPage from '../pages/admin/MessagesPage';

// Admin Layout
import AdminLayout from '../components/admin/AdminLayout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/admin/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Portfolio */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="projects"     element={<ProjectsPage />} />
          <Route path="skills"       element={<SkillsPage />} />
          <Route path="experiences"  element={<ExperiencesPage />} />
          <Route path="messages"     element={<MessagesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
