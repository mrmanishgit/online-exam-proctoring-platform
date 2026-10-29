import { Box, Typography } from "@mui/material";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} mb={1}>
        Forgot password?
      </Typography>

      <Typography color="text.secondary" mb={3}>
        We'll help you request a password reset.
      </Typography>

      <ForgotPasswordForm />
    </Box>
  );
}