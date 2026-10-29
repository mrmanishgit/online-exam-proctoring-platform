import { Button, Stack, Tooltip } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

export default function CodeToolbar({
  onRun,
  onSubmit,
  onReset,
  code = "",
  running = false,
  submitting = false,
  disabled = false,
  showSubmit = true,
}) {
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard access may be blocked by browser permissions.
    }
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      justifyContent="space-between"
      alignItems={{ sm: "center" }}
    >
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button
          variant="outlined"
          startIcon={<RestartAltRoundedIcon />}
          onClick={onReset}
          disabled={disabled || running || submitting}
        >
          Reset code
        </Button>

        <Tooltip title="Copy source code">
          <span>
            <Button
              variant="outlined"
              startIcon={<ContentCopyRoundedIcon />}
              onClick={copyCode}
              disabled={!code}
            >
              Copy
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button
          variant="outlined"
          color="success"
          startIcon={<PlayArrowRoundedIcon />}
          onClick={onRun}
          disabled={disabled || running || submitting}
        >
          {running ? "Running..." : "Run code"}
        </Button>

        {showSubmit && (
          <Button
            variant="contained"
            startIcon={<SendRoundedIcon />}
            onClick={onSubmit}
            disabled={disabled || running || submitting}
          >
            {submitting ? "Submitting..." : "Submit solution"}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}