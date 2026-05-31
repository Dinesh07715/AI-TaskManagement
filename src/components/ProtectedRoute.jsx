import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import { USER_ROLES } from "../utils/constants";


export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner label="Checking session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;

  if (allowedRoles?.length) {
    const role = user?.role;
    console.log("Logged User:", user);
    console.log("Role:", user?.role);
    if (!role || !allowedRoles.includes(role)) {
      const fallback = role === USER_ROLES.ADMIN ? "/dashboard/admin" : "/dashboard/user";
      return <Navigate to={fallback} replace />;
    }
  }

  return <Outlet />;
}
