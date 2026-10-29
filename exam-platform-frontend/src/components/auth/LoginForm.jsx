import { useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import PasswordField from "./PasswordField";
import useAuth from "../../hooks/useAuth";
import { getDashboardPath, ROUTES } from "../../app/routeConfig";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({
        email: form.email.trim(),
        password: form.password,
        rememberMe: form.rememberMe,
      });

      const destination =
        location.state?.from?.pathname || getDashboardPath(user.role);

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Sign-in failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
      <Typography color="text.secondary" mb={1}>
        Enter your account details to continue.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={2}>
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid #CBD5E1",
            borderRadius: "10px",
            fontSize: "15px",
          }}
        />

        <PasswordField
          name="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <FormControlLabel
          control={
            <Checkbox
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
          }
          label="Remember me"
        />

        <MuiLink
          component={RouterLink}
          to={ROUTES.FORGOT_PASSWORD}
          underline="hover"
          fontWeight={600}
          variant="body2"
        >
          Forgot password?
        </MuiLink>
      </Stack>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        fullWidth
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <Typography textAlign="center" variant="body2" color="text.secondary">
        Don't have an account?{" "}
        <MuiLink component={RouterLink} to={ROUTES.REGISTER} fontWeight={700}>
          Create account
        </MuiLink>
      </Typography>
    </Stack>
  );
}