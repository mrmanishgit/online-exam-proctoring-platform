import {
  Alert,
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";

export default function ExecutionResult({
  result,
  loading = false,
  error = null,
}) {
  if (loading) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <HourglassBottomRoundedIcon color="primary" />
          <Typography>Executing code...</Typography>
        </Stack>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {typeof error === "string"
          ? error
          : error.message || "Code execution failed."}
      </Alert>
    );
  }

  if (!result) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography color="text.secondary">
          Run your code to see the execution results here.
        </Typography>
      </Paper>
    );
  }

  const status = String(result.status || result.verdict || "Completed");
  const passed = ["passed", "success", "accepted"].includes(
    status.toLowerCase()
  );
  const failed = [
    "failed",
    "error",
    "runtime_error",
    "compilation_error",
    "wrong_answer",
  ].includes(status.toLowerCase());

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" fontWeight={800}>
          Execution result
        </Typography>

        <Chip
          icon={
            passed ? (
              <CheckCircleRoundedIcon />
            ) : failed ? (
              <ErrorRoundedIcon />
            ) : undefined
          }
          label={status.replaceAll("_", " ")}
          color={passed ? "success" : failed ? "error" : "default"}
        />
      </Stack>

      {result.message && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {result.message}
        </Typography>
      )}

      {[
        ["Output", result.output ?? result.stdout],
        ["Error output", result.stderr ?? result.errorOutput],
        ["Compilation output", result.compileOutput],
      ].map(
        ([label, value]) =>
          value !== undefined && value !== null && (
            <Box key={label} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75 }}>
                {label}
              </Typography>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 1.5,
                  bgcolor: "action.hover",
                  borderRadius: 1.5,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: label === "Error output" ? "error.main" : "text.primary",
                }}
              >
                {String(value) || "(empty)"}
              </Box>
            </Box>
          )
      )}

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {result.executionTime !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Execution time: {result.executionTime} ms
          </Typography>
        )}

        {result.memoryUsed !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Memory: {result.memoryUsed}
          </Typography>
        )}

        {result.passedTests !== undefined && result.totalTests !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Test cases: {result.passedTests}/{result.totalTests} passed
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}