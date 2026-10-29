import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

const STATUS_CONFIG = {
  ready: {
    label: "Ready",
    color: "success",
    icon: <CheckCircleRoundedIcon fontSize="small" />,
  },
  active: {
    label: "Monitoring active",
    color: "success",
    icon: <CheckCircleRoundedIcon fontSize="small" />,
  },
  warning: {
    label: "Warning",
    color: "warning",
    icon: <WarningAmberRoundedIcon fontSize="small" />,
  },
  failed: {
    label: "Check required",
    color: "error",
    icon: <WarningAmberRoundedIcon fontSize="small" />,
  },
  inactive: {
    label: "Inactive",
    color: "default",
    icon: <RadioButtonUncheckedRoundedIcon fontSize="small" />,
  },
};

export default function ProctoringStatus({
  status = "inactive",
  message,
  compact = false,
}) {
  const normalized = String(status).toLowerCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.inactive;

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
    >
      <Tooltip title={message || config.label}>
        <Chip
          icon={config.icon}
          label={config.label}
          color={config.color}
          size={compact ? "small" : "medium"}
          variant="outlined"
        />
      </Tooltip>

      {!compact && message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Stack>
  );
}