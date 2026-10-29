import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";

export default function CameraPreview({
  autoStart = false,
  onStreamChange,
  onError,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setActive(false);
    onStreamChange?.(null);
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const message = "Camera access is not supported in this browser or context.";
      setError(message);
      onError?.(message);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      stream.getVideoTracks().forEach((track) => {
        track.addEventListener("ended", () => {
          setActive(false);
          setError("Camera stream ended.");
          onStreamChange?.(null);
        });
      });

      setActive(true);
      onStreamChange?.(stream);
    } catch (err) {
      const message =
        err.name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access in your browser settings."
          : err.name === "NotFoundError"
            ? "No camera was found on this device."
            : "Unable to start the camera. Check your device and browser permissions.";

      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoStart) startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [autoStart]);

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <CameraAltRoundedIcon color="primary" />
          <Typography variant="h6" fontWeight={800}>
            Camera preview
          </Typography>
        </Stack>

        <Box
          sx={{
            position: "relative",
            bgcolor: "#111827",
            borderRadius: 2,
            overflow: "hidden",
            aspectRatio: "16 / 10",
            display: "grid",
            placeItems: "center",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            aria-label="Live camera preview"
            style={{
              display: active ? "block" : "none",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />

          {!active && (
            <Stack alignItems="center" spacing={1}>
              <VideocamOffRoundedIcon
                sx={{ fontSize: 48, color: "#9ca3af" }}
              />
              <Typography sx={{ color: "#d1d5db" }}>
                Camera is not active
              </Typography>
            </Stack>
          )}

          {active && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                px: 1.25,
                py: 0.5,
                borderRadius: 1,
                bgcolor: "error.main",
                color: "white",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              LIVE PREVIEW
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
          {!active ? (
            <Button
              fullWidth
              variant="contained"
              onClick={startCamera}
              disabled={loading}
            >
              {loading ? "Starting camera..." : "Start camera"}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={stopCamera}
            >
              Stop camera
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}