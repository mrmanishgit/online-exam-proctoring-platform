import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/routeConfig";
import useAuth from "../../hooks/useAuth";
import { useCustomTheme } from "../../contexts/ThemeContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const closeMenus = () => {
    setMobileMenuAnchor(null);
    setProfileAnchor(null);
  };

  const handleLogout = async () => {
    closeMenus();
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const navLinks = [
    { label: "Home", path: ROUTES.HOME },
    { label: "About", path: ROUTES.ABOUT },
    { label: "Contact", path: ROUTES.CONTACT },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 76, gap: 3 }}>
          <Stack
            component={Link}
            to={ROUTES.HOME}
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{ textDecoration: "none", color: "primary.main", flexGrow: 1 }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                bgcolor: "primary.main",
                color: "white",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: 23,
              }}
            >
              E
            </Box>
            <Typography variant="h6" fontWeight={900}>
              ExamPilot
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navLinks.map((item) => (
              <Typography
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  textDecoration: "none",
                  fontWeight: 650,
                  fontSize: 14,
                  color: "text.secondary",
                  "&.active": { color: "primary.main" },
                  "&:hover": { color: "primary.main" },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={toggleTheme}
              aria-label="Toggle theme"
              color="inherit"
            >
              {mode === "light" ? (
                <DarkModeRoundedIcon />
              ) : (
                <LightModeRoundedIcon />
              )}
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton
                  aria-label="Notifications"
                  onClick={() => navigate("/student")}
                  color="inherit"
                >
                  <NotificationsNoneRoundedIcon />
                </IconButton>

                <Button
                  onClick={(event) => setProfileAnchor(event.currentTarget)}
                  startIcon={
                    <Avatar sx={{ width: 30, height: 30, bgcolor: "primary.main" }}>
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                  }
                  sx={{ color: "text.primary", display: { xs: "none", sm: "flex" } }}
                >
                  {user?.name || "Account"}
                </Button>

                <Menu
                  anchorEl={profileAnchor}
                  open={Boolean(profileAnchor)}
                  onClose={closeMenus}
                >
                  <MenuItem onClick={() => { closeMenus(); navigate(`/${user?.role?.toLowerCase()}`); }}>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                </Menu>
              </>
            ) : (
              <Stack
                direction="row"
                spacing={1}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <Button component={Link} to={ROUTES.LOGIN} color="inherit">
                  Sign in
                </Button>
                <Button
                  component={Link}
                  to={ROUTES.REGISTER}
                  variant="contained"
                >
                  Get started
                </Button>
              </Stack>
            )}

            <IconButton
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              onClick={(event) => setMobileMenuAnchor(event.currentTarget)}
              aria-label="Open navigation menu"
            >
              <MenuRoundedIcon />
            </IconButton>

            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={closeMenus}
            >
              {navLinks.map((item) => (
                <MenuItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={closeMenus}
                >
                  {item.label}
                </MenuItem>
              ))}

              {!isAuthenticated && [
                <MenuItem
                  key="login"
                  component={Link}
                  to={ROUTES.LOGIN}
                  onClick={closeMenus}
                >
                  Sign in
                </MenuItem>,
                <MenuItem
                  key="register"
                  component={Link}
                  to={ROUTES.REGISTER}
                  onClick={closeMenus}
                >
                  Create account
                </MenuItem>,
              ]}
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}