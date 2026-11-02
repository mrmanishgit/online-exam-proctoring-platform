import { useState } from "react";
import {
  Alert,
  Button,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PasswordField from "./PasswordField";
import PasswordStrength from "./PasswordStrength";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../app/routeConfig";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const nameParts = form.fullName.trim().split(/\\s+/);
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ") || "-";

      await register({
        firstName,
        lastName,
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { registrationSuccess: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
      <Typography color="text.secondary">
        Create an account to access your examination workspace.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        name="fullName"
        label="Full name"
        value={form.fullName}
        onChange={handleChange}
        autoComplete="name"
        required
      />

      <TextField
        name="email"
        label="Email address"
        type="email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />



      <PasswordField
        name="password"
        label="Create password"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
      />

      <PasswordStrength password={form.password} />

      <PasswordField
        name="confirmPassword"
        label="Confirm password"
        value={form.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
      />

      <Alert severity="info">
        Public registration creates a student account. Employee and administrator
        accounts must be created by an authorized administrator.
      </Alert>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        fullWidth
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>

      <Typography textAlign="center" variant="body2" color="text.secondary">
        Already have an account?{" "}
        <MuiLink component={RouterLink} to={ROUTES.LOGIN} fontWeight={700}>
          Sign in
        </MuiLink>
      </Typography>
    </Stack>
  );
}