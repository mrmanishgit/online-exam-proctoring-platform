import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const labels = {
  student: "Student",
  employee: "Employee",
  admin: "Admin",
  exams: "Exams",
  attempts: "Attempts",
  results: "Results",
  profile: "Profile",
  users: "Users",
  questions: "Questions",
  schedules: "Schedules",
  invitations: "Invitations",
  monitoring: "Monitoring",
  reports: "Reports",
  notifications: "Notifications",
  settings: "Settings",
  create: "Create",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <MuiBreadcrumbs sx={{ mb: 3 }}>
      <Link
        component={RouterLink}
        to="/"
        underline="hover"
        color="inherit"
      >
        Home
      </Link>

      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const label =
          labels[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1);

        return index === segments.length - 1 ? (
          <Typography color="text.primary" key={path}>
            {label}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            to={path}
            underline="hover"
            color="inherit"
            key={path}
          >
            {label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}