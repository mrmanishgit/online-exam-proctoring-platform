import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function PermissionCheck({
  requireCamera = true,
  requireMicrophone = false,
  requireScreenShare = false,
  onComplete,
}) {
  const [permissions, setPermissions] = useState({
    camera: "idle",
    microphone: "idle",
    screen: "idle",
  });
  const [error, setError] = useState("");

  const checkCamera = async () => {
    try {
      setError("");
      setPermissions((current) => ({ ...current, camera: "checking" }));

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      stream.getTracks().forEach((track) => track.stop());

      setPermissions((current) => ({ ...current, camera: "granted" }));
    } catch {
      setPermissions((current) => ({ ...current, camera: "denied" }));
      setError("Camera permission was not granted. Check your browser settings.");
    }
  };

  const checkMicrophone = async () => {
    try {
      setError("");
      setPermissions((current) => ({ ...current, microphone: "checking" }));

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      stream.getTracks().forEach((track) => track.stop());

      setPermissions((current) => ({ ...current, microphone: "granted" }));
    } catch {
      setPermissions((current) => ({ ...current, microphone: "denied" }));
      setError("Microphone permission was not granted. Check your browser settings.");
    }
  };

  const checkScreen = async () => {
    try {
      setError("");
      setPermissions((current) => ({ ...current, screen: "checking" }));

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      setPermissions((current) => ({ ...current, screen: "granted" }));
    } catch {
      setPermissions((current) => ({ ...current, screen: "denied" }));
      setError("Screen sharing was cancelled or permission was denied.");
    }
  };

  const requirements = [
    {
      key: "camera",
      label: "Camera access",
      description: "Allow camera access if your exam requires webcam monitoring.",
      icon: <CameraAltRoundedIcon />,
      required: requireCamera,
      action: checkCamera,
    },
    {
      key: "microphone",
      label: "Microphone access",
      description: "Check microphone access if required for your assessment.",
      icon: <MicRoundedIcon />,
      required: requireMicrophone,
      action: checkMicrophone,
    },
    {
      key: "screen",
      label: "Screen sharing",
      description: "Share your screen if the assessment requires it.",
      icon: <DesktopWindowsRoundedIcon />,
      required: requireScreenShare,
      action: checkScreen,
    },
  ];

  const requiredItems = requirements.filter((item) => item.required);
  const allRequiredGranted = requiredItems.every(
    (item) => permissions[item.key] === "granted"
  );

  const handleContinue = () => {
    if (!allRequiredGranted) {
      setError("Complete all required permission checks before continuing.");
      return;
    }

    onComplete?.({ ...permissions });
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" fontWeight={800}>
          Device permissions
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Verify the permissions required by your assessment. Browser support and
          permissions can vary by device.
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          {requirements.map((item) => {
            const status = permissions[item.key];
            const granted = status === "granted";

            return (
              <Card key={item.key} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ sm: "center" }}
                  >
                    {item.icon}

                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                      <Typography fontWeight={700}>
                        {item.label}
                        {item.required ? " (Required)" : " (Optional)"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Stack>

                    {granted ? (
                      <Button
                        color="success"
                        startIcon={<CheckCircleRoundedIcon />}
                        disabled
                      >
                        Checked
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={item.action}
                        disabled={status === "checking"}
                      >
                        {status === "checking" ? "Checking..." : "Check"}
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={!allRequiredGranted}
          onClick={handleContinue}
        >
          Continue to exam
        </Button>
      </CardContent>
    </Card>
  );
}