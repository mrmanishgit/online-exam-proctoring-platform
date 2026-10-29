import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CircularProgress, Stack, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../app/routeConfig";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Stack
        minHeight="60vh"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <CircularProgress />
        <Typography color="text.secondary">
          Loading your workspace...
        </Typography>
      </Stack>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}