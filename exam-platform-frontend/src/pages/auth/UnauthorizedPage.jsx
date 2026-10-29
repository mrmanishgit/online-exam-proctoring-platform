import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <Box
      sx={{
        minHeight: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack alignItems="center" spacing={2.5} textAlign="center" maxWidth={480}>
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            bgcolor: "error.light",
            color: "error.dark",
            display: "grid",
            placeItems: "center",
          }}
        >
          <BlockRoundedIcon sx={{ fontSize: 46 }} />
        </Box>

        <Typography variant="h4" fontWeight={800}>
          Access denied
        </Typography>

        <Typography color="text.secondary">
          You don't have permission to access this page. Sign in with an
          authorized account or return to your dashboard.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button component={Link} to="/" variant="outlined">
            Go to home
          </Button>

          <Button component={Link} to="/login" variant="contained">
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}