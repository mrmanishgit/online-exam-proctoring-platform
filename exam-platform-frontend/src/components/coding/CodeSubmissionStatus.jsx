import {
  Alert,
  Box,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const STATUS_MAP = {
  queued: {
    label: "Queued",
    color: "default",
    icon: <PendingOutlinedIcon />,
  },
  pending: {
    label: "Pending",
    color: "default",
    icon: <PendingOutlinedIcon />,
  },
  running: {
    label: "Running",
    color: "info",
    icon: <PendingOutlinedIcon />,
  },
  accepted: {
    label: "Accepted",
    color: "success",
    icon: <CheckCircleOutlineRoundedIcon />,
  },
  passed: {
    label: "Passed",
    color: "success",
    icon: <CheckCircleOutlineRoundedIcon />,
  },
  failed: {
    label: "Failed",
    color: "error",
    icon: <CancelOutlinedIcon />,
  },
  wrong_answer: {
    label: "Wrong answer",
    color: "error",
    icon: <CancelOutlinedIcon />,
  },
  compilation_error: {
    label: "Compilation error",
    color: "error",
    icon: <CancelOutlinedIcon />,
  },
  runtime_error: {
    label: "Runtime error",
    color: "error",
    icon: <CancelOutlinedIcon />,
  },
};

export default function CodeSubmissionStatus({
  status,
  message,
  passedTests,
  totalTests,
}) {
  if (!status) {
    return (
      <Alert severity="info">
        Submit your solution to view its evaluation status.
      </Alert>
    );
  }

  const normalizedStatus = String(status).toLowerCase();
  const config = STATUS_MAP[normalizedStatus] || {
    label: String(status).replaceAll("_", " "),
    color: "default",
    icon: undefined,
  };

  const isRunning = ["queued", "pending", "running"].includes(normalizedStatus);
  const hasTestProgress =
    Number.isFinite(passedTests) && Number.isFinite(totalTests) && totalTests > 0;

  return (
    <Box sx={{ width: "100%" }}>
      {isRunning && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        flexWrap="wrap"
        useFlexGap
      >
        <Typography variant="subtitle1" fontWeight={800}>
          Submission status
        </Typography>

        <Chip
          icon={config.icon}
          label={config.label}
          color={config.color}
        />
      </Stack>

      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}

      {hasTestProgress && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography variant="body2">Test cases passed</Typography>
            <Typography variant="body2" fontWeight={700}>
              {passedTests}/{totalTests}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, (passedTests / totalTests) * 100))}
            color={passedTests === totalTests ? "success" : "primary"}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}
    </Box>
  );
}