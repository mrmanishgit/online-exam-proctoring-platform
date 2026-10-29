import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  FlagOutlined,
  SaveOutlined,
  Send,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const demoQuestions = [
  {
    id: "q1",
    type: "single",
    question: "What is the next number in the sequence: 2, 6, 12, 20, 30, __?",
    options: ["36", "40", "42", "44"],
    answer: "42",
  },
  {
    id: "q2",
    type: "single",
    question: "Which data structure follows the FIFO principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
  },
  {
    id: "q3",
    type: "single",
    question: "If all roses are flowers and some flowers fade quickly, which statement is definitely true?",
    options: [
      "All flowers are roses",
      "All roses fade quickly",
      "All roses are flowers",
      "No roses fade quickly",
    ],
    answer: "All roses are flowers",
  },
  {
    id: "q4",
    type: "single",
    question: "What is the time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    answer: "O(log n)",
  },
  {
    id: "q5",
    type: "single",
    question: "Which SQL clause is used to filter grouped records?",
    options: ["WHERE", "ORDER BY", "HAVING", "GROUP BY"],
    answer: "HAVING",
  },
];

const EXAM_DURATION_SECONDS = 30 * 60;

export default function AptitudeExamPage() {
  const navigate = useNavigate();
  const { examId } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(
    EXAM_DURATION_SECONDS,
  );
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = demoQuestions[currentIndex];

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers],
  );

  useEffect(() => {
    if (submitted) return undefined;

    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          setSubmitDialogOpen(true);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [submitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  };

  const selectAnswer = (value) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
  };

  const toggleMarked = () => {
    setMarked((previous) =>
      previous.includes(currentQuestion.id)
        ? previous.filter((id) => id !== currentQuestion.id)
        : [...previous, currentQuestion.id],
    );
  };

  const submitExam = () => {
    setSubmitted(true);

    const correctCount = demoQuestions.filter(
      (question) => answers[question.id] === question.answer,
    ).length;

    navigate(`/student/exams/${examId}/submission`, {
      state: {
        answers,
        totalQuestions: demoQuestions.length,
        answeredCount,
        correctCount,
        score: Math.round((correctCount / demoQuestions.length) * 100),
        submittedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <Box>
      <PageHeader
        title="Aptitude Assessment"
        subtitle="Demo exam interface — connect the submission and autosave APIs before production use."
        action={
          <Chip
            icon={<SaveOutlined />}
            label="Local session"
            color="info"
            variant="outlined"
          />
        }
      />

      <Alert severity="warning" sx={{ mb: 2 }}>
        This is demo question data. Answers are kept in page state only and are
        not persisted to the server.
      </Alert>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                General Aptitude
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {demoQuestions.length} questions · Single choice
              </Typography>
            </Box>

            <Chip
              label={`Time remaining: ${formatTime(remainingSeconds)}`}
              color={remainingSeconds < 300 ? "error" : "primary"}
              sx={{ fontWeight: 700, fontSize: 14, py: 2.2 }}
            />
          </Stack>

          <LinearProgress
            variant="determinate"
            value={(answeredCount / demoQuestions.length) * 100}
            sx={{ mt: 2, height: 7, borderRadius: 5 }}
          />

          <Typography variant="caption" color="text.secondary">
            {answeredCount} of {demoQuestions.length} answered
          </Typography>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 250px" },
          gap: 3,
        }}
      >
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Chip label={`Question ${currentIndex + 1}`} color="primary" />
              <Button
                startIcon={<FlagOutlined />}
                color={marked.includes(currentQuestion.id) ? "warning" : "inherit"}
                onClick={toggleMarked}
              >
                {marked.includes(currentQuestion.id) ? "Marked" : "Mark for review"}
              </Button>
            </Stack>

            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              {currentQuestion.question}
            </Typography>

            <RadioGroup
              value={answers[currentQuestion.id] ?? ""}
              onChange={(event) => selectAnswer(event.target.value)}
            >
              {currentQuestion.options.map((option, index) => (
                <Box
                  key={option}
                  sx={{
                    border: 1,
                    borderColor:
                      answers[currentQuestion.id] === option
                        ? "primary.main"
                        : "divider",
                    bgcolor:
                      answers[currentQuestion.id] === option
                        ? "action.selected"
                        : "background.paper",
                    borderRadius: 2,
                    px: 2,
                    mb: 1.5,
                  }}
                >
                  <FormControlLabel
                    value={option}
                    control={<Radio />}
                    label={`${String.fromCharCode(65 + index)}. ${option}`}
                    sx={{ width: "100%", py: 0.5, m: 0 }}
                  />
                </Box>
              ))}
            </RadioGroup>

            <Divider sx={{ my: 3 }} />

            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
            >
              <Button
                startIcon={<ArrowBack />}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((index) => index - 1)}
              >
                Previous
              </Button>

              {currentIndex < demoQuestions.length - 1 ? (
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => setCurrentIndex((index) => index + 1)}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Send />}
                  onClick={() => setSubmitDialogOpen(true)}
                >
                  Submit Exam
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, alignSelf: "start" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Question navigator
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 1,
              }}
            >
              {demoQuestions.map((question, index) => {
                const isAnswered = Boolean(answers[question.id]);
                const isMarked = marked.includes(question.id);

                return (
                  <Button
                    key={question.id}
                    variant={currentIndex === index ? "contained" : "outlined"}
                    color={isMarked ? "warning" : isAnswered ? "success" : "inherit"}
                    onClick={() => setCurrentIndex(index)}
                    sx={{ minWidth: 0, px: 0, aspectRatio: "1 / 1" }}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              <Typography variant="caption">
                Answered: {answeredCount}
              </Typography>
              <Typography variant="caption">
                Unanswered: {demoQuestions.length - answeredCount}
              </Typography>
              <Typography variant="caption">
                Marked for review: {marked.length}
              </Typography>
            </Stack>

            <Button
              fullWidth
              color="success"
              variant="contained"
              startIcon={<Send />}
              sx={{ mt: 3 }}
              onClick={() => setSubmitDialogOpen(true)}
            >
              Submit Exam
            </Button>
          </CardContent>
        </Card>
      </Box>

      <ConfirmDialog
        open={submitDialogOpen}
        title="Submit examination?"
        message={`You have answered ${answeredCount} of ${demoQuestions.length} questions. Are you sure you want to submit?`}
        confirmText="Submit Exam"
        cancelText="Continue Exam"
        onConfirm={submitExam}
        onCancel={() => {
          if (remainingSeconds > 0) setSubmitDialogOpen(false);
          else submitExam();
        }}
      />
    </Box>
  );
}