import { Button, Divider, Paper, Stack, Typography } from "@mui/material";

export default function ExamSummary({
  title = "Exam summary",
  totalQuestions = 0,
  answeredQuestions = 0,
  markedQuestions = 0,
  unansweredQuestions,
  duration,
  onReview,
  onSubmit,
  submitting = false,
}) {
  const unanswered = unansweredQuestions ?? Math.max(0, totalQuestions - answeredQuestions);

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
      <Stack spacing={1.5} divider={<Divider flexItem />}>
        <SummaryRow label="Total questions" value={totalQuestions} />
        <SummaryRow label="Answered" value={answeredQuestions} />
        <SummaryRow label="Unanswered" value={unanswered} />
        <SummaryRow label="Marked for review" value={markedQuestions} />
        {duration != null && <SummaryRow label="Duration" value={duration} />}
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
        {onReview && <Button fullWidth variant="outlined" onClick={onReview}>Review answers</Button>}
        {onSubmit && <Button fullWidth variant="contained" onClick={onSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit exam"}</Button>}
      </Stack>
    </Paper>
  );
}

function SummaryRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Stack>
  );
}
