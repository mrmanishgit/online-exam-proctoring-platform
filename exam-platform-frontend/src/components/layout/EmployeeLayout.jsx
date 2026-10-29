import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import useAuth from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";

export default function EmployeeLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          elevation={0}
          color="inherit"
          sx={{ borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Toolbar sx={{ minHeight: 72, gap: 2 }}>
            {!isDesktop && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
              >
                <MenuRoundedIcon />
              </IconButton>
            )}

            <Box sx={{ flexGrow: 1 }}>
              <Typography fontWeight={750}>Employee Workspace</Typography>
              <Typography variant="caption" color="text.secondary">
                Assessments and candidate management
              </Typography>
            </Box>

            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {user?.name?.charAt(0)?.toUpperCase() || "E"}
            </Avatar>

            <Stack spacing={0}>
              <Typography variant="body2" fontWeight={700}>
                {user?.name || "Employee"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Employee / Examiner
              </Typography>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
          <Breadcrumbs />
          <Box sx={{ maxWidth: 1500, mx: "auto" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}