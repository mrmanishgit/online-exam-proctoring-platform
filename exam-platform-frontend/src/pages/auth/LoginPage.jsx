import { Alert, Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} mb={1}>
        Welcome back
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Sign in to continue to your examination workspace.
      </Typography>

      {registrationSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Registration submitted. Follow any email verification instructions
          before signing in.
        </Alert>
      )}

      <LoginForm />
    </Box>
  );
}