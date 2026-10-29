import { Box, Chip, Stack, Typography } from "@mui/material";

export default function SubjectPerformance({ subjects = [], title = "Subject performance" }) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{title}</Typography>
      {subjects.length === 0 ? (
        <Typography color="text.secondary">No subject performance data available.</Typography>
      ) : (
        <Stack spacing={1.25}>
          {subjects.map((subject, index) => {
            const percentage = subject.percentage ?? (
              Number(subject.maxScore ?? 0) > 0
                ? (Number(subject.score ?? 0) / Number(subject.maxScore)) * 100
                : null
            );
            return (
              <Stack key={subject.id ?? subject.name ?? index} direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Box>
                  <Typography fontWeight={600}>{subject.name ?? `Subject ${index + 1}`}</Typography>
                  {subject.score != null && subject.maxScore != null && (
                    <Typography variant="body2" color="text.secondary">{subject.score} / {subject.maxScore}</Typography>
                  )}
                </Box>
                <Chip
                  size="small"
                  label={percentage == null ? "N/A" : `${Number(percentage).toFixed(1)}%`}
                  color={percentage == null ? "default" : percentage >= 70 ? "success" : percentage >= 40 ? "warning" : "error"}
                />
              </Stack>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
