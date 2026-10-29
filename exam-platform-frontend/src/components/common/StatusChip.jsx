import { Chip } from "@mui/material";

const statusColors = {
  ACTIVE: "success",
  COMPLETED: "success",
  SUBMITTED: "success",
  EVALUATED: "success",
  SCHEDULED: "info",
  IN_PROGRESS: "warning",
  PENDING: "warning",
  DRAFT: "default",
  NOT_STARTED: "default",
  CANCELLED: "error",
  TERMINATED: "error",
  FAILED: "error",
  EXPIRED: "error",
};

export default function StatusChip({ status, size = "small" }) {
  const normalized = String(status || "UNKNOWN").toUpperCase();

  return (
    <Chip
      size={size}
      label={normalized.replaceAll("_", " ")}
      color={statusColors[normalized] || "default"}
      variant="outlined"
      sx={{ fontWeight: 700 }}
    />
  );
}