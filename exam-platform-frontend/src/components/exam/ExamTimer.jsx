import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function ExamTimer({
  durationMinutes,
  initialSeconds,
  endTime,
  onExpire,
  warningSeconds = 300,
  compact = false,
}) {
  const calculateRemaining = () => {
    if (endTime) {
      const end = new Date(endTime).getTime();
      if (Number.isFinite(end)) {
        return Math.max(0, Math.floor((end - Date.now()) / 1000));
      }
    }

    if (Number.isFinite(initialSeconds)) {
      return Math.max(0, Math.floor(initialSeconds));
    }

    return Math.max(0, Math.floor(Number(durationMinutes || 60) * 60));
  };

  const [remaining, setRemaining] = useState(calculateRemaining);

  useEffect(() => {
    setRemaining(calculateRemaining());
  }, [durationMinutes, initialSeconds, endTime]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return undefined;
    }

    const interval = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [remaining, onExpire]);

  const isWarning = remaining <= warningSeconds;
  const isCritical = remaining <= 60;

  return (
    <Box
      role="timer"
      aria-live={isCritical ? "assertive" : "off"}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: compact ? 1.25 : 2,
        py: compact ? 0.75 : 1.25,
        borderRadius: 2,
        bgcolor: isCritical
          ? "error.light"
          : isWarning
            ? "warning.light"
            : "action.hover",
        color: isCritical
          ? "error.dark"
          : isWarning
            ? "warning.dark"
            : "text.primary",
      }}
    >
      <AccessTimeRoundedIcon fontSize={compact ? "small" : "medium"} />

      <Stack spacing={0}>
        {!compact && (
          <Typography variant="caption" fontWeight={600}>
            Time remaining
          </Typography>
        )}
        <Typography
          variant={compact ? "body1" : "h6"}
          fontWeight={800}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {formatTime(remaining)}
        </Typography>
      </Stack>
    </Box>
  );
}