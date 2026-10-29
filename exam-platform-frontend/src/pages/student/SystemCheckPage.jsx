import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  CameraAlt,
  CheckCircle,
  ReportProblem,
  Language,
  Mic,
  Monitor,
  Refresh,
  Security,
  Wifi,
} from "@mui/icons-material";

import PageHeader from "../../components/common/PageHeader";

const checks = [
  {
    key: "internet",
    title: "Internet connection",
    description: "Confirm that your browser is connected to the internet.",
    icon: Wifi,
  },
  {
    key: "browser",
    title: "Browser compatibility",
    description: "Use an updated browser for the best exam experience.",
    icon: Language,
  },
  {
    key: "camera",
    title: "Camera permission",
    description: "Allow access to your webcam before the exam.",
    icon: CameraAlt,
  },
  {
    key: "microphone",
    title: "Microphone permission",
    description: "Allow microphone access if required by the exam.",
    icon: Mic,
  },
  {
    key: "fullscreen",
    title: "Display readiness",
    description: "Make sure your screen is ready for the examination.",
    icon: Monitor,
  },
];

export default function SystemCheckPage() {
  const navigate = useNavigate();
  const { examId } = useParams();

  const [results, setResults] = useState({
    internet: "passed",
    browser: "passed",
    camera: "pending",
    microphone: "pending",
    fullscreen: "pending",
  });

  const [checking, setChecking] = useState(false);

  const runChecks = async () => {
    setChecking(true);

    const nextResults = {
      internet: navigator.onLine ? "passed" : "failed",
      browser: "passed",
      camera: "pending",
      microphone: "pending",
      fullscreen: "passed",
    };

    try {
      const stream = await navigator.mediaDevices?.getUserMedia({
        video: true,
        audio: true,
      });

      if (stream) {
        const videoAvailable = stream.getVideoTracks().length > 0;
        const audioAvailable = stream.getAudioTracks().length > 0;

        nextResults.camera = videoAvailable ? "passed" : "failed";
        nextResults.microphone = audioAvailable ? "passed" : "failed";

        stream.getTracks().forEach((track) => track.stop());
      } else {
        nextResults.camera = "failed";
        nextResults.microphone = "failed";
      }
    } catch {
      nextResults.camera = "failed";
      nextResults.microphone = "failed";
    }

    setResults(nextResults);
    setChecking(false);
  };

  const allPassed = Object.values(results).every(
    (result) => result === "passed",
  );

  const statusChip = (status) => {
  if (status === "passed") {
    return (
      <Chip
        icon={<CheckCircle />}
        label="Passed"
        color="success"
      />
    );
  }

  if (status === "failed") {
    return (
      <Chip
        icon={<ReportProblem />}
        label="Failed"
        color="error"
      />
    );
  }

  return <Chip label="Not checked" />;
};
  const startExam = () => {
    navigate(`/student/exams/${examId}/take`);
  };

  return (
    <Box>
      <PageHeader
        title="System Check"
        subtitle="Verify your device before starting the examination."
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        Camera and microphone checks request real browser permissions. This
        page does not record or transmit media.
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Typography variant="h6" fontWeight={700}>
                  Device readiness
                </Typography>

                <Button
                  startIcon={<Refresh />}
                  onClick={runChecks}
                  disabled={checking}
                >
                  Run checks
                </Button>
              </Stack>

              {checks.map((check, index) => {
                const Icon = check.icon;

                return (
                  <Box key={check.key}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      py={2}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon color="primary" />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={600}>
                          {check.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {check.description}
                        </Typography>
                      </Box>

                      {statusChip(results[check.key])}
                    </Stack>

                    {index !== checks.length - 1 && <Divider />}
                  </Box>
                );
              })}

              <Button
                fullWidth
                variant="outlined"
                onClick={runChecks}
                disabled={checking}
                sx={{ mt: 2 }}
              >
                {checking ? "Checking devices..." : "Test Camera & Microphone"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Security color="primary" sx={{ fontSize: 34, mb: 1 }} />
              <Typography variant="h6" fontWeight={700} mb={1}>
                Privacy reminder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Device access is controlled by your browser. Review the
                platform's privacy policy to understand how exam monitoring
                data is handled.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={1}>
                Ready to begin?
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Complete the checks before proceeding to the exam.
              </Typography>

              <Button
                fullWidth
                variant="contained"
                disabled={!allPassed}
                onClick={startExam}
              >
                Start Examination
              </Button>

              {!allPassed && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1.5}
                >
                  Run the checks and resolve any failed items to continue.
                </Typography>
              )}

              <Button
                fullWidth
                sx={{ mt: 1 }}
                onClick={() =>
                  navigate(`/student/exams/${examId}/instructions`)
                }
              >
                Back to Instructions
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}