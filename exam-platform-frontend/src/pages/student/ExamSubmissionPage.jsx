import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  CheckCircleRounded,
  HomeOutlined,
  ListAltOutlined,
  EmojiEventsOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";

export default function ExamSubmissionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { examId } = useParams();

  const result = location.state ?? {};
  const isCoding = result.type === "coding";

  const score = Number.isFinite(result.score) ? result.score : null;
  const totalQuestions = result.totalQuestions ?? null;
  const answeredCount = result.answeredCount ?? null;

  return (
    <Box>
      <PageHeader
        title="Exam Submission"
        subtitle="Review the status of your examination submission."
      />

      <Card sx={{ maxWidth: 800, mx: "auto", borderRadius: 4 }}>
        <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
          <Box
            sx={{
              width: 88,
              height: 88,
              mx: "auto",
              mb: 2.5,
              borderRadius: "50%",
              bgcolor: "success.light",
              color: "success.dark",
              display: "grid",
              placeItems: "center",
            }}
          >
            <CheckCircleRounded  sx={{ fontSize: 54 }} />
          </Box>

          <Typography variant="h4" fontWeight={800} gutterBottom>
            Submission Received
          </Typography>

          <Typography color="text.secondary" sx={{ maxWidth: 520, mx: "auto" }}>
            {result.backendConfirmed ? "Your attempt was submitted and confirmed by the ExamPilot backend." : "Your submission status has not been confirmed by the backend."}
          </Typography>

          <Chip label={result.backendConfirmed ? "Backend confirmed" : "Not confirmed"} color={result.backendConfirmed ? "success" : "warning"} variant="outlined" sx={{ mt: 2 }} />

          <Alert severity="info" sx={{ mt: 3, textAlign: "left" }}>
            {isCoding
              ? "Your code has not been sent to a server or evaluated. Connect the coding submission API to persist and assess it."
              : (result.backendConfirmed ? `Attempt #${result.attemptId} has been saved. Results will appear after publication.` : "Your answers have not been confirmed by the server.")}
          </Alert>

          <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
            {totalQuestions !== null && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={800}>
                    {totalQuestions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total questions
                  </Typography>
                </Box>
              </Grid>
            )}

            {answeredCount !== null && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={800}>
                    {answeredCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Answered
                  </Typography>
                </Box>
              </Grid>
            )}

            {score !== null && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={800}>
                    {score}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Demo score
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              startIcon={<ListAltOutlined />}
              onClick={() => navigate("/student/attempts")}
            >
              My Attempts
            </Button>

            <Button
              variant="outlined"
              startIcon={<EmojiEventsOutlined />}
              onClick={() => navigate("/student/results")}
            >
              My Results
            </Button>

            <Button
              variant="text"
              startIcon={<HomeOutlined />}
              onClick={() => navigate("/student/dashboard")}
            >
              Dashboard
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" display="block" mt={3}>
            Exam reference: {examId || "Unavailable"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}