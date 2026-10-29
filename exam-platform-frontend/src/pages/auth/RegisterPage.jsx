import { Box, Typography } from "@mui/material";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} mb={1}>
        Create your account
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Join ExamPilot to take exams and track your performance.
      </Typography>

      <RegisterForm />
    </Box>
  );
}