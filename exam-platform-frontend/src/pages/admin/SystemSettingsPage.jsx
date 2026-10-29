import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PageHeader from "../../components/common/PageHeader";

const DEFAULT_SETTINGS = {
  platformName: "ExamPilot",
  supportEmail: "support@example.com",
  defaultDuration: 60,
  passingScore: 50,
  maxAttempts: 2,
  autosaveSeconds: 15,
  requireCamera: true,
  requireMicrophone: false,
  requireScreenShare: true,
  requireFullscreen: true,
  shuffleQuestions: true,
  allowResultReview: true,
  emailNotifications: true,
  maintenanceMode: false,
};

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("exampilot_admin_settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [savedMessage, setSavedMessage] = useState(false);
  const [error, setError] = useState("");

  const updateSetting = (name, value) => {
    setSettings((current) => ({ ...current, [name]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setError("");

    if (!settings.platformName.trim()) {
      setError("Platform name is required.");
      return;
    }

    if (!settings.supportEmail.trim()) {
      setError("Support email is required.");
      return;
    }

    if (settings.defaultDuration < 1 || settings.defaultDuration > 600) {
      setError("Default exam duration must be between 1 and 600 minutes.");
      return;
    }

    if (settings.passingScore < 0 || settings.passingScore > 100) {
      setError("Passing score must be between 0 and 100.");
      return;
    }

    localStorage.setItem("exampilot_admin_settings", JSON.stringify(settings));
    setSavedMessage(true);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("exampilot_admin_settings");
    setError("");
    setSavedMessage(true);
  };

  const switchOptions = [
    {
      key: "requireCamera",
      label: "Require camera",
      description: "Ask candidates to enable their webcam before an exam.",
    },
    {
      key: "requireMicrophone",
      label: "Require microphone",
      description: "Request microphone permission for supported exams.",
    },
    {
      key: "requireScreenShare",
      label: "Require screen sharing",
      description: "Require candidates to share their screen when supported.",
    },
    {
      key: "requireFullscreen",
      label: "Require fullscreen",
      description: "Ask candidates to enter fullscreen during assessments.",
    },
    {
      key: "shuffleQuestions",
      label: "Shuffle questions",
      description: "Randomize question order when an exam allows it.",
    },
    {
      key: "allowResultReview",
      label: "Allow result review",
      description: "Allow candidates to review results after publication.",
    },
    {
      key: "emailNotifications",
      label: "Email notifications",
      description: "Enable system-generated email notifications.",
    },
    {
      key: "maintenanceMode",
      label: "Maintenance mode",
      description: "Display a maintenance state when supported by the application.",
    },
  ];

  return (
    <Box>
      <PageHeader
        title="System Settings"
        subtitle="Configure default exam behavior and platform preferences."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSave}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: "100%", borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800}>
                  General settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Basic platform information and default exam values.
                </Typography>

                <Stack spacing={2.5}>
                  <TextField
                    label="Platform name"
                    fullWidth
                    value={settings.platformName}
                    onChange={(event) => updateSetting("platformName", event.target.value)}
                    required
                  />

                  <TextField
                    label="Support email"
                    type="email"
                    fullWidth
                    value={settings.supportEmail}
                    onChange={(event) => updateSetting("supportEmail", event.target.value)}
                    required
                  />

                  <TextField
                    label="Default exam duration (minutes)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 1, max: 600 }}
                    value={settings.defaultDuration}
                    onChange={(event) =>
                      updateSetting("defaultDuration", Number(event.target.value))
                    }
                  />

                  <TextField
                    label="Passing score (%)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                    value={settings.passingScore}
                    onChange={(event) =>
                      updateSetting("passingScore", Number(event.target.value))
                    }
                  />

                  <TextField
                    select
                    label="Maximum attempts"
                    fullWidth
                    value={settings.maxAttempts}
                    onChange={(event) =>
                      updateSetting("maxAttempts", Number(event.target.value))
                    }
                  >
                    {[1, 2, 3, 4, 5].map((count) => (
                      <MenuItem key={count} value={count}>
                        {count} {count === 1 ? "attempt" : "attempts"}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Answer autosave interval"
                    fullWidth
                    value={settings.autosaveSeconds}
                    onChange={(event) =>
                      updateSetting("autosaveSeconds", Number(event.target.value))
                    }
                  >
                    {[5, 10, 15, 30, 60].map((seconds) => (
                      <MenuItem key={seconds} value={seconds}>
                        Every {seconds} seconds
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{ height: "100%", borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800}>
                  Exam and proctoring
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose default behavior for supported assessments.
                </Typography>

                {switchOptions.map((option, index) => (
                  <Box key={option.key}>
                    <FormControlLabel
                      sx={{ alignItems: "flex-start", mx: 0, py: 1 }}
                      control={
                        <Switch
                          checked={Boolean(settings[option.key])}
                          onChange={(event) =>
                            updateSetting(option.key, event.target.checked)
                          }
                        />
                      }
                      label={
                        <Box sx={{ pt: 0.5 }}>
                          <Typography fontWeight={700}>{option.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      }
                    />
                    {index < switchOptions.length - 1 && <Divider />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="flex-end"
          sx={{ mt: 3 }}
        >
          <Button variant="outlined" color="inherit" onClick={handleReset}>
            Reset defaults
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveRoundedIcon />}
          >
            Save settings
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={savedMessage}
        autoHideDuration={3000}
        onClose={() => setSavedMessage(false)}
        message="Settings saved in this browser."
      />
    </Box>
  );
}