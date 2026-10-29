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
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import StopScreenShareRoundedIcon from "@mui/icons-material/StopScreenShareRounded";

export default function ScreenSharePreview({ onStreamChange, onError }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [sharing, setSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stopSharing = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setSharing(false);
    onStreamChange?.(null);
  };

  const startSharing = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      const message = "Screen sharing is not supported in this browser.";
      setError(message);
      onError?.(message);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        setSharing(false);
        streamRef.current = null;
        onStreamChange?.(null);
      });

      setSharing(true);
      onStreamChange?.(stream);
    } catch (err) {
      const message =
        err.name === "NotAllowedError"
          ? "Screen sharing was cancelled or permission was denied."
          : "Unable to start screen sharing.";

      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    []
  );

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <DesktopWindowsRoundedIcon color="primary" />
          <Typography variant="h6" fontWeight={800}>
            Screen sharing
          </Typography>
        </Stack>

        <Box
          sx={{
            aspectRatio: "16 / 9",
            bgcolor: "#111827",
            borderRadius: 2,
            overflow: "hidden",
            display: "grid",
            placeItems: "center",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            aria-label="Shared screen preview"
            style={{
              display: sharing ? "block" : "none",
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />

          {!sharing && (
            <Stack alignItems="center" spacing={1}>
              <DesktopWindowsRoundedIcon
                sx={{ fontSize: 48, color: "#9ca3af" }}
              />
              <Typography sx={{ color: "#d1d5db" }}>
                Screen is not being shared
              </Typography>
            </Stack>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          sx={{ mt: 2 }}
          variant={sharing ? "outlined" : "contained"}
          color={sharing ? "error" : "primary"}
          startIcon={
            sharing ? <StopScreenShareRoundedIcon /> : <DesktopWindowsRoundedIcon />
          }
          disabled={loading}
          onClick={sharing ? stopSharing : startSharing}
        >
          {loading
            ? "Requesting permission..."
            : sharing
              ? "Stop sharing"
              : "Share screen"}
        </Button>
      </CardContent>
    </Card>
  );
}