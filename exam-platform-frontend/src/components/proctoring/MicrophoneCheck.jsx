import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";

export default function MicrophoneCheck({ onStatusChange }) {
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const [active, setActive] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState("");

  const stopCheck = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;

    setActive(false);
    setLevel(0);
    onStatusChange?.(false);
  };

  const startCheck = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone access is not supported in this browser or context.");
      return;
    }

    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        throw new Error("Audio analysis is not supported in this browser.");
      }

      const audioContext = new AudioContextClass();
      await audioContext.resume();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      setActive(true);
      onStatusChange?.(true);

      const samples = new Uint8Array(analyser.frequencyBinCount);

      const measureLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteTimeDomainData(samples);

        let sum = 0;
        for (const sample of samples) {
          const normalized = (sample - 128) / 128;
          sum += normalized * normalized;
        }

        const rms = Math.sqrt(sum / samples.length);
        setLevel(Math.min(100, Math.round(rms * 300)));

        animationRef.current = requestAnimationFrame(measureLevel);
      };

      measureLevel();
    } catch (err) {
      setError(
        err.message ||
          "Unable to access the microphone. Check your browser permissions."
      );
      onStatusChange?.(false);
    }
  };

  useEffect(() => stopCheck, []);

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          {active ? (
            <MicRoundedIcon color="primary" />
          ) : (
            <MicOffRoundedIcon color="action" />
          )}
          <Typography variant="h6" fontWeight={800}>
            Microphone check
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Allow microphone access and speak normally to check the detected audio
          level. Audio is measured locally by this component.
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2">Audio level</Typography>
            <Typography variant="body2" fontWeight={700}>
              {active ? `${level}%` : "Inactive"}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={active ? level : 0}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        {active && level < 3 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No significant audio detected yet. Try speaking near the microphone.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {active ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={stopCheck}
          >
            Stop microphone check
          </Button>
        ) : (
          <Button fullWidth variant="contained" onClick={startCheck}>
            Start microphone check
          </Button>
        )}
      </CardContent>
    </Card>
  );
}