import { Box, LinearProgress, Stack, Typography } from "@mui/material";

export default function ExamProgress({
  current = 0,
  total = 0,
  answered = 0,
  marked = 0,
  showDetails = true,
}) {
  const safeTotal = Math.max(0, Number(total) || 0);
  const safeCurrent = Math.min(
    safeTotal,
    Math.max(0, Number(current) || 0)
  );
  const safeAnswered = Math.min(
    safeTotal,
    Math.max(0, Number(answered) || 0)
  );
  const safeMarked = Math.min(
    safeTotal,
    Math.max(0, Number(marked) || 0)
  );

  const progress = safeTotal ? (safeAnswered / safeTotal) * 100 : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 1 }}
      >
        <Typography variant="body2" fontWeight={700}>
          Exam progress
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {safeTotal ? `${safeCurrent} of ${safeTotal}` : "0 questions"}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 5,
          bgcolor: "action.hover",
          "& .MuiLinearProgress-bar": { borderRadius: 5 },
        }}
      />

      {showDetails && (
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 1.5 }}
        >
          <Typography variant="caption" color="success.main">
            Answered: {safeAnswered}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Remaining: {Math.max(0, safeTotal - safeAnswered)}
          </Typography>
          <Typography variant="caption" color="warning.main">
            Marked for review: {safeMarked}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}