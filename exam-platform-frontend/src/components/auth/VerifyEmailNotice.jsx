import { Alert, Button, Stack, Typography } from "@mui/material";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import { Link as RouterLink } from "react-router-dom";

export default function VerifyEmailNotice({ email = "" }) {
  return (
    <Stack spacing={2.5} alignItems="center" textAlign="center">
      <MarkEmailReadRoundedIcon color="primary" sx={{ fontSize: 64 }} />

      <Typography variant="h5" fontWeight={800}>
        Verify your email
      </Typography>

      <Typography color="text.secondary">
        {email
          ? `If verification is required, follow the instructions sent to ${email}.`
          : "Check your inbox for the email verification instructions."}
      </Typography>

      <Alert severity="info" sx={{ width: "100%", textAlign: "left" }}>
        If you don't see the email, check your spam folder. Verification links
        may expire.
      </Alert>

      <Button
        component={RouterLink}
        to="/verify-email"
        variant="outlined"
        fullWidth
      >
        Open verification page
      </Button>

      <Button component={RouterLink} to="/login" fullWidth>
        Return to sign in
      </Button>
    </Stack>
  );
}