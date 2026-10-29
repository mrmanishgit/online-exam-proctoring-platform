import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  AccessTime,
  CheckCircleRounded,
  Code,
  InfoOutlined,
  Laptop,
  Security,
  WarningAmber,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";

const instructions = [
  "Read each question carefully before answering.",
  "Your answers are saved automatically when the backend supports autosave.",
  "Do not refresh or close the browser during an active exam.",
  "The exam timer continues running while you answer questions.",
  "Use the question navigator to review unanswered questions.",
  "Submit your exam before the timer expires.",
];

const proctoringRules = [
  "Allow camera and microphone access when requested.",
  "Keep your face visible to the webcam throughout the exam.",
  "Do not switch tabs or open unauthorized applications.",
  "Do not share your screen with another person.",
];

export default function ExamInstructionsPage() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) return;
    navigate(`/student/exams/${examId}/system-check`);
  };

  return (
    <Box>
      <PageHeader
        title="Exam Instructions"
        subtitle="Review the rules carefully before starting your assessment."
      />

      <Alert severity="info" icon={<InfoOutlined />} sx={{ mb: 3 }}>
        Please complete the system check before entering the examination.
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <AccessTime color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Examination rules
                </Typography>
              </Stack>

                       <List disablePadding>
                    {instructions.map((instruction) => (
                      <ListItem key={instruction} alignItems="flex-start">
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleRounded color="success" />
                        </ListItemIcon>

                        <ListItemText
                          primary={instruction}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    ))}
                  </List>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <Security color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Online proctoring rules
                </Typography>
              </Stack>

              <List disablePadding>
                {proctoringRules.map((rule) => (
                  <ListItem key={rule} alignItems="flex-start">
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <WarningAmber color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={rule}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                ))}
              </List>

              <Alert severity="warning" sx={{ mt: 2 }}>
                Proctoring events may be recorded and reviewed according to the
                examination policy. Violations may be flagged for review.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{ p: 3, borderRadius: 3, position: "sticky", top: 24 }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Before you begin
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Laptop color="primary" />
                <Typography variant="body2">
                  Use a stable computer and internet connection.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Security color="primary" />
                <Typography variant="body2">
                  Keep your webcam and microphone ready.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Code color="primary" />
                <Typography variant="body2">
                  For coding exams, check your editor and supported language.
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                mb: 2,
              }}
            >
              <Checkbox
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                inputProps={{ "aria-label": "Accept exam instructions" }}
                sx={{ p: 0 }}
              />
              <Typography variant="body2">
                I have read and understood the examination instructions and
                agree to follow the rules.
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!accepted}
              onClick={handleContinue}
            >
              Continue to System Check
            </Button>

            <Button
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate(`/student/exams/${examId}`)}
            >
              Back to Exam Details
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}