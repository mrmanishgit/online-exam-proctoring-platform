import { useState } from "react";
import {
  Alert,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import PasswordField from "./PasswordField";
import PasswordStrength from "./PasswordStrength";
import authService from "../../services/authService";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("The password reset link is missing its token.");
      return;
    }

    if (password.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        token,
        newPassword: password,
      });

      setMessage("Your password has been reset. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "The reset request failed. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
      <Typography color="text.secondary">
        Choose a new password for your ExamPilot account.
      </Typography>

      {message && (
        <Alert severity="success">
          {message} <RouterLink to="/login">Sign in</RouterLink>
        </Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <PasswordField
        name="newPassword"
        label="New password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
      />

      <PasswordStrength password={password} />

      <PasswordField
        name="confirmPassword"
        label="Confirm new password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading || Boolean(message)}
      >
        {loading ? "Resetting password..." : "Reset password"}
      </Button>

      <Button component={RouterLink} to="/login">
        Back to sign in
      </Button>
    </Stack>
  );
}