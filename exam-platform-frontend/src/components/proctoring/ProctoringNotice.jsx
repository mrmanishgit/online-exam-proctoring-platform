import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { useState } from "react";

export default function ProctoringNotice({
  onAccept,
  requireConsent = true,
  loading = false,
}) {
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (requireConsent && !accepted) return;
    onAccept?.();
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <SecurityRoundedIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight={800}>
            Online exam monitoring notice
          </Typography>
        </Stack>

        <Alert severity="info" sx={{ mb: 2 }}>
          This assessment may use device permissions and monitoring features
          configured by the exam administrator.
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Before proceeding, review the assessment instructions and the
          organization's privacy notice. Only grant the camera, microphone, or
          screen-sharing permissions that the exam requires.
        </Typography>

        <Box component="ul" sx={{ pl: 3, color: "text.secondary", mb: 2 }}>
          <li>
            <Typography variant="body2">
              Keep your face visible if webcam monitoring is required.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Do not leave the assessment page unless the instructions permit it.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Monitoring events may be reviewed according to the exam policy.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Contact the exam administrator if a permission request fails.
            </Typography>
          </li>
        </Box>

        {requireConsent && (
          <FormControlLabel
            control={
              <Checkbox
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
              />
            }
            label="I have read and understood the exam monitoring notice."
          />
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleContinue}
          disabled={loading || (requireConsent && !accepted)}
        >
          {loading ? "Continuing..." : "Continue"}
        </Button>
      </CardContent>
    </Card>
  );
}