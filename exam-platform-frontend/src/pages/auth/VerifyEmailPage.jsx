import { useEffect, useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import authService from "../../services/authService";
import Loader from "../../components/common/Loader";
import ResendVerification from "../../components/auth/ResendVerification";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(Boolean(token));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function verify() {
      if (!token) return;

      try {
        await authService.verifyEmail(token);
        if (active) setSuccess(true);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Verification failed. The link may be invalid or expired."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    verify();

    return () => {
      active = false;
    };
  }, [token]);

  if (loading) {
    return <Loader message="Verifying your email..." />;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} mb={1}>
        Email verification
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Confirm your email address to complete the verification process.
      </Typography>

      {success ? (
        <Stack spacing={2}>
          <Alert severity="success">
            Your email has been verified successfully.
          </Alert>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            fullWidth
          >
            Continue to sign in
          </Button>
        </Stack>
      ) : (
        <Stack spacing={3}>
          <Alert severity={error ? "error" : "info"}>
            {error || "Open the verification link from your email to verify your account."}
          </Alert>

          <ResendVerification />

          <Button component={RouterLink} to="/login">
            Back to sign in
          </Button>
        </Stack>
      )}
    </Box>
  );
}