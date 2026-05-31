import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "../layouts/AppLayout";
import AIAssistantPage from "../pages/AIAssistantPage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
import SettingsPage from "../pages/SettingsPage";
import TaskFormPage from "../pages/TaskFormPage";
import TaskListPage from "../pages/TaskListPage";
import UsersPage from "../pages/UsersPage";
import { USER_ROLES } from "../utils/constants";

function DashboardRedirect() {
  const { user } = useAuth();
  return <Navigate to={user?.role === USER_ROLES.ADMIN ? "/dashboard/admin" : "/dashboard/user"} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
          <Route path="/user" element={<Navigate to="/dashboard/user" replace />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route
            path="/dashboard/admin"
            element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}
          >
            <Route index element={<DashboardPage />} />
          </Route>
          <Route
            path="/dashboard/user"
            element={<ProtectedRoute allowedRoles={[USER_ROLES.USER, USER_ROLES.ADMIN]} />}
          >
            <Route index element={<DashboardPage />} />
          </Route>
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<TaskFormPage />} />
          <Route path="/tasks/edit/:id" element={<TaskFormPage />} />
          <Route path="/ai" element={<AIAssistantPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
            <Route index element={<UsersPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
