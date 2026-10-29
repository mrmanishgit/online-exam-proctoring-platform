import { useState } from "react";
import {
  Alert,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import authService from "../../services/authService";

export default function ResendVerification() {
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
      await authService.resendVerification(email.trim().toLowerCase());
      setMessage(
        "If your account needs verification, instructions will be sent to your email."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process the request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
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
        disabled={loading}
        fullWidth
      >
        {loading ? "Sending..." : "Resend verification email"}
      </Button>
    </Stack>
  );
}