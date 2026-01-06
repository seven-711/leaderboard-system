import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppProvider, useAppStore } from "./services/store";
import Layout from "./components/Layout/Layout";
import Leaderboard from "./pages/Leaderboard"; // Real Page
import DepartmentProfile from "./pages/DepartmentProfile"; // Real Page
import LiveFeed from "./pages/LiveFeed"; // Real Page
import Games from "./pages/Games";
import Departments from "./pages/Departments"; // Real Page
import Login from "./pages/Login";

import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import GameManagement from "./pages/Admin/GameManagement";
import ScoreEntry from "./pages/Admin/ScoreEntry";
import UserManagement from "./pages/Admin/UserManagement";
import SystemConfig from "./pages/Admin/SystemConfig";
import DepartmentManagement from "./pages/Admin/DepartmentManagement";

import { ToastProvider } from "./components/Common/Toast";

// Auth Guard Component
const RequireAuth = () => {
  const { currentUser } = useAppStore();
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={<Layout><Leaderboard /></Layout>} />
            <Route path="/live" element={<Layout><LiveFeed /></Layout>} />
            <Route path="/games" element={<Layout><Games /></Layout>} />
            <Route path="/departments" element={<Layout><Departments /></Layout>} />
            <Route path="/department/:id" element={<Layout><DepartmentProfile /></Layout>} />

            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes (Protected) */}
            <Route element={<RequireAuth />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="departments" element={<DepartmentManagement />} />
                <Route path="games" element={<GameManagement />} />
                <Route path="scores" element={<ScoreEntry />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<SystemConfig />} />
              </Route>
            </Route>
            {/* Catch-all for 404 - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
