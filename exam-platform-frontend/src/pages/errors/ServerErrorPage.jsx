import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Link } from "react-router-dom";

export default function ServerErrorPage() {
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
          <ErrorOutlineRoundedIcon sx={{ fontSize: 46 }} />
        </Box>

        <Typography variant="h4" fontWeight={800}>
          Something went wrong
        </Typography>

        <Typography color="text.secondary">
          We couldn't complete your request. Please try again later.
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>

          <Button component={Link} to="/" variant="contained">
            Go home
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}