import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default function Loader({
  message = "Loading...",
  fullScreen = false,
  size = 42,
}) {
  return (
    <Box
      sx={{
        minHeight: fullScreen ? "100vh" : 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={size} thickness={4} />
        <Typography color="text.secondary" variant="body2">
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}