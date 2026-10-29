import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function ExamCard({
  exam,
  onView,
  onStart,
  showStartButton = false,
}) {
  if (!exam) return null;

  const title = exam.title || exam.name || "Untitled exam";
  const duration = exam.durationMinutes ?? exam.duration ?? 60;
  const questionCount =
    exam.questionCount ?? exam.totalQuestions ?? exam.questions?.length ?? 0;
  const status = exam.status || "Scheduled";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <QuizRoundedIcon />
          </Box>

          <Chip
            size="small"
            label={status}
            color={
              ["active", "published", "completed"].includes(
                String(status).toLowerCase()
              )
                ? "success"
                : ["cancelled", "expired"].includes(String(status).toLowerCase())
                  ? "error"
                  : "default"
            }
          />
        </Stack>

        <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: 40,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {exam.description || "Review the instructions before beginning this assessment."}
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <AccessTimeRoundedIcon fontSize="small" color="action" />
            <Typography variant="body2">{duration} min</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.75}>
            <QuizRoundedIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {questionCount} questions
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Stack direction="row" spacing={1}>
          {onView && (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onView(exam)}
              endIcon={<ArrowForwardRoundedIcon />}
            >
              View details
            </Button>
          )}

          {showStartButton && onStart && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => onStart(exam)}
            >
              Start exam
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
}