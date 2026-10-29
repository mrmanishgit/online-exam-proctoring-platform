import { Alert, Button, Stack } from "@mui/material";

export default function ErrorMessage({
  message = "Something went wrong. Please try again.",
  severity = "error",
  onRetry,
}) {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>

      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Stack>
  );
}