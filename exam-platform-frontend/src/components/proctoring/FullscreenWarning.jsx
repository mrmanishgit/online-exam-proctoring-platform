import { Alert, Button, Stack, Typography } from "@mui/material";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";

export default function FullscreenWarning({
  active = false,
  onEnterFullscreen,
  onDismiss,
  required = true,
}) {
  if (active) return null;

  return (
    <Alert
      severity={required ? "warning" : "info"}
      icon={<FullscreenRoundedIcon />}
      action={
        <Stack direction="row" spacing={1}>
          {onDismiss && !required && (
            <Button color="inherit" size="small" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
          <Button color="inherit" size="small" onClick={onEnterFullscreen}>
            Enter fullscreen
          </Button>
        </Stack>
      }
      sx={{ borderRadius: 2, alignItems: "center" }}
    >
      <Typography fontWeight={700}>
        Fullscreen mode {required ? "required" : "recommended"}
      </Typography>
      <Typography variant="body2">
        {required
          ? "Enter fullscreen to continue with this assessment."
          : "Fullscreen mode may help you focus on your assessment."}
      </Typography>
    </Alert>
  );
}