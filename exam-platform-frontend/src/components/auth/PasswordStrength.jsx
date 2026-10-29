import { Box, LinearProgress, Stack, Typography } from "@mui/material";

function calculateStrength(password = "") {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const score = checks.filter(Boolean).length;

  if (!password) {
    return { score: 0, label: "", color: "inherit" };
  }

  if (score <= 2) {
    return { score, label: "Weak", color: "error" };
  }

  if (score <= 3) {
    return { score, label: "Fair", color: "warning" };
  }

  if (score === 4) {
    return { score, label: "Good", color: "info" };
  }

  return { score, label: "Strong", color: "success" };
}

export default function PasswordStrength({ password = "" }) {
  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <Stack spacing={1}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          Password strength
        </Typography>
        <Typography
          variant="caption"
          fontWeight={700}
          color={`${strength.color}.main`}
        >
          {strength.label}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={(strength.score / 5) * 100}
        color={strength.color === "inherit" ? "primary" : strength.color}
        sx={{ height: 6, borderRadius: 5 }}
      />

      <Typography variant="caption" color="text.secondary">
        Use 8+ characters with uppercase, lowercase, numbers, and symbols.
      </Typography>
    </Stack>
  );
}