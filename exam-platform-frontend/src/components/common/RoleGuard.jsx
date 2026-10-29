import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getDashboardPath, ROUTES } from "../../app/routeConfig";

export default function RoleGuard({ allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}