import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function QuestionPalette({
  totalQuestions = 0,
  currentIndex = 0,
  answers = {},
  markedQuestions = [],
  onSelect,
  disabled = false,
}) {
  const markedSet = new Set(markedQuestions.map(Number));

  const isAnswered = (index) => {
    const answer = answers[index] ?? answers[String(index)];

    if (Array.isArray(answer)) return answer.length > 0;
    return answer !== undefined && answer !== null && answer !== "";
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
          Question navigator
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          {Array.from({ length: totalQuestions }, (_, index) => {
            const answered = isAnswered(index);
            const marked = markedSet.has(index);
            const current = currentIndex === index;

            return (
              <Button
                key={index}
                variant={current ? "contained" : "outlined"}
                color={current ? "primary" : marked ? "warning" : answered ? "success" : "inherit"}
                disabled={disabled}
                onClick={() => onSelect?.(index)}
                sx={{
                  minWidth: 0,
                  minHeight: 42,
                  p: 0.5,
                  fontWeight: 800,
                }}
                aria-label={`Go to question ${index + 1}${answered ? ", answered" : ", unanswered"}${marked ? ", marked for review" : ""}`}
              >
                {index + 1}
              </Button>
            );
          })}
        </Box>

        <Stack spacing={1} sx={{ mt: 2.5 }}>
          {[
            ["primary.main", "Current question"],
            ["success.main", "Answered"],
            ["warning.main", "Marked for review"],
            ["divider", "Not answered"],
          ].map(([color, label]) => (
            <Stack direction="row" spacing={1} alignItems="center" key={label}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: color,
                  border: color === "divider" ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}