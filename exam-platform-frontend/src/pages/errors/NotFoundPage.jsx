import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack alignItems="center" spacing={2.5} textAlign="center" maxWidth={500}>
        <Typography
          variant="h1"
          fontWeight={900}
          sx={{
            fontSize: { xs: "5rem", md: "8rem" },
            lineHeight: 1,
            background: "linear-gradient(135deg, #4F46E5, #0EA5E9)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </Typography>

        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 3,
            bgcolor: "action.hover",
            display: "grid",
            placeItems: "center",
            color: "primary.main",
          }}
        >
          <SearchOffRoundedIcon sx={{ fontSize: 38 }} />
        </Box>

        <Typography variant="h4" fontWeight={800}>
          Page not found
        </Typography>

        <Typography color="text.secondary">
          The page you're looking for doesn't exist or may have been moved.
        </Typography>

        <Button component={Link} to="/" variant="contained" size="large">
          Return to home
        </Button>
      </Stack>
    </Box>
  );
}