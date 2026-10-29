import { useState } from "react";
import {
  Alert,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import authService from "../../services/authService";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setMessage(
        "If an account exists for this email, password reset instructions will be sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
      <Typography color="text.secondary">
        Enter the email address associated with your account to request a
        password reset.
      </Typography>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Email address"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
      >
        {loading ? "Sending request..." : "Send reset instructions"}
      </Button>

      <Button component={RouterLink} to="/login" variant="text">
        Back to sign in
      </Button>
    </Stack>
  );
}