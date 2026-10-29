import { Box, Typography } from "@mui/material";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} mb={1}>
        Reset your password
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Enter and confirm your new password below.
      </Typography>

      <ResetPasswordForm />
    </Box>
  );
}