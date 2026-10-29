import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

const exams = {
  "EX-101": {
    title: "Java Programming Assessment",
    category: "Programming",
    duration: 60,
    questions: 30,
    description: "Test Java fundamentals, object-oriented programming, collections, exception handling, and problem-solving skills.",
    instructions: [
      "Read each question carefully before selecting an answer.",
      "Do not refresh or close the browser during an active exam.",
      "Ensure your internet connection is stable.",
      "Review your answers before submitting.",
    ],
  },
  "EX-102": {
    title: "Database Fundamentals",
    category: "Technical",
    duration: 45,
    questions: 25,
    description: "Evaluate SQL, relational database concepts, joins, indexing, and normalization.",
    instructions: [
      "Read every question carefully.",
      "Choose the most appropriate answer.",
      "Do not leave the exam page during the assessment.",
      "Submit your answers before the timer expires.",
    ],
  },
  "EX-103": {
    title: "Logical Reasoning Test",
    category: "Aptitude",
    duration: 30,
    questions: 20,
    description: "Assess logical thinking, patterns, sequences, and analytical reasoning.",
    instructions: [
      "Read each problem carefully.",
      "Manage your time across all questions.",
      "Review marked questions before submission.",
      "Submit before the time limit expires.",
    ],
  },
};

export default function ExamDetailsPage() {
  const { examId } = useParams();
  const exam = exams[examId] || {
    title: "Assessment details",
    category: "General",
    duration: 60,
    questions: 20,
    description: "This assessment's detailed information will be available when connected to the backend.",
    instructions: [
      "Read the official examination instructions.",
      "Check your system before starting.",
      "Do not leave the exam page during the assessment.",
      "Submit your answers before time expires.",
    ],
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Exam details"
        subtitle="Review the assessment information and instructions before continuing."
        breadcrumbs={[
          { label: "Student", path: "/student" },
          { label: "Available exams", path: "/student/exams" },
          { label: exam.title },
        ]}
      />

      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 60, height: 60, borderRadius: 3, bgcolor: "#EEF2FF", color: "#4F46E5", display: "grid", placeItems: "center" }}>
            <QuizRoundedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight={850}>
              {exam.title}
            </Typography>
            <Chip label={exam.category} color="primary" variant="outlined" sx={{ mt: 1 }} />
          </Box>
        </Stack>

        <Typography color="text.secondary" lineHeight={1.9} mt={3}>
          {exam.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AccessTimeRoundedIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">Duration</Typography>
                <Typography fontWeight={750}>{exam.duration} minutes</Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <QuizRoundedIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">Questions</Typography>
                <Typography fontWeight={750}>{exam.questions}</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <ShieldRoundedIcon color="primary" />
          <Typography variant="h6" fontWeight={800}>Important instructions</Typography>
        </Stack>

        <Stack spacing={1.5}>
          {exam.instructions.map((instruction, index) => (
            <Stack key={instruction} direction="row" spacing={1.5} alignItems="flex-start">
              <Chip label={index + 1} size="small" color="primary" />
              <Typography color="text.secondary">{instruction}</Typography>
            </Stack>
          ))}
        </Stack>

        <Alert severity="info" sx={{ mt: 3 }}>
          Some exams may require camera, microphone, or screen-sharing permissions. Any monitoring requirements should be shown and explained before the exam begins.
        </Alert>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3}>
          <Button
            component={Link}
            to="/student/exams"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
          >
            Back to exams
          </Button>

          <Button
            component={Link}
            to={`/student/exams/${examId}/instructions`}
            variant="contained"
          >
            Continue to instructions
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}