import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import PageHeader from "../../components/common/PageHeader";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));

    setError("");
    setSuccess(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }

    setError(
      "The contact form is not connected to a backend yet. Your message has not been sent."
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <PageHeader
        title="Contact us"
        subtitle="Questions about examinations, accounts, or platform access? Use the contact form."
      />

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <EmailOutlinedIcon
                color="primary"
                sx={{ fontSize: 34, mb: 2 }}
              />

              <Typography variant="h6" fontWeight={800} mb={1}>
                Email support
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                Contact your organization's designated ExamPilot
                administrator for account or examination assistance.
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <SupportAgentRoundedIcon
                color="primary"
                sx={{ fontSize: 34, mb: 2 }}
              />

              <Typography variant="h6" fontWeight={800} mb={1}>
                Examination support
              </Typography>

              <Typography color="text.secondary" lineHeight={1.8}>
                If you are taking an exam, follow the instructions supplied by
                your examiner or institution when requesting help.
              </Typography>
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}
          >
            <Typography variant="h5" fontWeight={800} mb={3}>
              Send us a message
            </Typography>

            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
              {error && (
                <Alert severity="warning">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success">
                  Your message was submitted.
                </Alert>
              )}

              <TextField
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <TextField
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <TextField
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              />

              <TextField
                label="Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                multiline
                minRows={5}
                required
              />

              <Button type="submit" variant="contained" size="large">
                Submit message
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}