import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Send, NotificationsActive } from "@mui/icons-material";

const initialForm = {
  title: "",
  message: "",
  audience: "ALL",
  type: "INFO",
};

export default function NotificationForm({
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.message.trim()) {
      setError("Title and message are required.");
      return;
    }

    try {
      await onSubmit?.({
        ...form,
        title: form.title.trim(),
        message: form.message.trim(),
      });

      setSuccess("Notification submitted successfully.");
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Unable to submit notification."
      );
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <NotificationsActive color="primary" fontSize="large" />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Create Notification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Send an announcement to selected platform users.
          </Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Notification Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            multiline
            minRows={4}
            required
            fullWidth
          />

          <TextField
            select
            label="Audience"
            name="audience"
            value={form.audience}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="ALL">All Users</MenuItem>
            <MenuItem value="STUDENT">Students</MenuItem>
            <MenuItem value="EMPLOYEE">Employees</MenuItem>
            <MenuItem value="ADMIN">Administrators</MenuItem>
          </TextField>

          <TextField
            select
            label="Notification Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="INFO">Information</MenuItem>
            <MenuItem value="SUCCESS">Success</MenuItem>
            <MenuItem value="WARNING">Warning</MenuItem>
            <MenuItem value="ERROR">Important / Error</MenuItem>
          </TextField>

          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Send Notification"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}