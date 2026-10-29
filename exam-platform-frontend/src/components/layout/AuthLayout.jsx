import {
  Box,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 3, md: 6 },
        px: 2,
        background:
          "radial-gradient(circle at 15% 15%, rgba(129,140,248,.22), transparent 35%), radial-gradient(circle at 85% 85%, rgba(14,165,233,.18), transparent 35%), #F8FAFC",
      }}
    >
      <Container maxWidth="sm">
        <Stack alignItems="center" spacing={1} mb={4}>
          <Stack
            component={Link}
            to="/"
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ textDecoration: "none", color: "#4F46E5" }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                display: "grid",
                placeItems: "center",
                borderRadius: 3,
                bgcolor: "#4F46E5",
                color: "white",
              }}
            >
              <VerifiedUserRoundedIcon fontSize="large" />
            </Box>

            <Typography variant="h5" fontWeight={900}>
              ExamPilot
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            Your secure online examination workspace
          </Typography>
        </Stack>

        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid #E2E8F0",
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            boxShadow: "0 24px 70px rgba(15,23,42,.09)",
          }}
        >
          <Outlet />
        </Box>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          color="text.secondary"
          mt={3}
        >
          Protected exam access · Privacy-focused design
        </Typography>
      </Container>
    </Box>
  );
}