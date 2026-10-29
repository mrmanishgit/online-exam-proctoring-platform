import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export default function SubmitExamDialog({
  open,
  onClose,
  onConfirm,
  totalQuestions = 0,
  answeredQuestions = 0,
  markedQuestions = 0,
  loading = false,
}) {
  const unanswered = Math.max(0, totalQuestions - answeredQuestions);

  return (
    <Dialog
      open={Boolean(open)}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <WarningAmberRoundedIcon color="warning" />
          Confirm exam submission
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Are you sure you want to submit your exam? Review your progress before
          confirming.
        </Typography>

        <Stack spacing={1}>
          <Typography>
            Total questions: <strong>{totalQuestions}</strong>
          </Typography>
          <Typography color="success.main">
            Answered: <strong>{answeredQuestions}</strong>
          </Typography>
          <Typography color={unanswered ? "error.main" : "text.primary"}>
            Unanswered: <strong>{unanswered}</strong>
          </Typography>
          <Typography color="warning.main">
            Marked for review: <strong>{markedQuestions}</strong>
          </Typography>
        </Stack>

        {unanswered > 0 && (
          <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
            You still have unanswered questions. You may return to them before
            submitting.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Continue exam
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Confirm submission"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}