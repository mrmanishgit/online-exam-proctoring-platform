import { Chip, Stack, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";

const STATUS_CONFIG = {
  saved: {
    label: "Saved",
    color: "success",
    icon: <CheckCircleOutlineRoundedIcon fontSize="small" />,
  },
  saving: {
    label: "Saving...",
    color: "info",
    icon: <SyncRoundedIcon fontSize="small" />,
  },
  unsaved: {
    label: "Unsaved changes",
    color: "warning",
    icon: <CloudUploadOutlinedIcon fontSize="small" />,
  },
  error: {
    label: "Save failed",
    color: "error",
    icon: <ErrorOutlineRoundedIcon fontSize="small" />,
  },
};

export default function SaveStatus({
  status = "saved",
  lastSavedAt,
  showLabel = true,
}) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.saved;

  const savedTime =
    lastSavedAt && status === "saved"
      ? new Date(lastSavedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Chip
        size="small"
        icon={config.icon}
        label={showLabel ? config.label : undefined}
        color={config.color}
        variant="outlined"
      />

      {savedTime && (
        <Typography variant="caption" color="text.secondary">
          Last saved {savedTime}
        </Typography>
      )}
    </Stack>
  );
}