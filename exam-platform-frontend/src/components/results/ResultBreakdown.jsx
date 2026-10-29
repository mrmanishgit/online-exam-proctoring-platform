import { Box, LinearProgress, Stack, Typography } from "@mui/material";

export default function ResultBreakdown({ sections = [], title = "Score breakdown" }) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{title}</Typography>
      {sections.length === 0 ? (
        <Typography color="text.secondary">No section breakdown is available.</Typography>
      ) : (
        <Stack spacing={2}>
          {sections.map((section, index) => {
            const score = Number(section.score ?? 0);
            const maximum = Number(section.maxScore ?? section.total ?? 0);
            const percent = maximum > 0 ? Math.min(100, Math.max(0, (score / maximum) * 100)) : 0;
            return (
              <Box key={section.id ?? section.name ?? index}>
                <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 0.5 }}>
                  <Typography fontWeight={600}>{section.name ?? `Section ${index + 1}`}</Typography>
                  <Typography variant="body2">{score} / {maximum}</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={percent} />
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
