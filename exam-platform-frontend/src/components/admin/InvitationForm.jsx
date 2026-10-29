import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Send, PersonAddAlt1 } from "@mui/icons-material";

export default function InvitationForm({
  exams = [],
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    examId: "",
    emails: "",
    role: "STUDENT",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailList, setEmailList] = useState([]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "emails") {
      setEmailList(
        value
          .split(/[\s,;]+/)
          .map((email) => email.trim())
          .filter(Boolean)
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.examId) {
      setError("Please select an exam.");
      return;
    }

    const emails = [
      ...new Set(
        form.emails
          .split(/[\s,;]+/)
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean)
      ),
    ];

    if (emails.length === 0) {
      setError("Enter at least one email address.");
      return;
    }

    const invalidEmails = emails.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (invalidEmails.length > 0) {
      setError(`Invalid email address: ${invalidEmails.join(", ")}`);
      return;
    }

    try {
      await onSubmit?.({
        examId: form.examId,
        emails,
        role: form.role,
        message: form.message.trim(),
      });

      setSuccess(`Invitation request submitted for ${emails.length} recipient(s).`);
      setForm({
        examId: "",
        emails: "",
        role: "STUDENT",
        message: "",
      });
      setEmailList([]);
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Unable to send invitations."
      );
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <PersonAddAlt1 color="primary" fontSize="large" />

        <Box>
          <Typography variant="h5" fontWeight={700}>
            Invite Candidates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Invite candidates to participate in a scheduled exam.
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            select
            label="Select Exam"
            name="examId"
            value={form.examId}
            onChange={updateField}
            required
            fullWidth
          >
            {exams.map((exam) => (
              <MenuItem key={exam.id} value={String(exam.id)}>
                {exam.title || exam.name || `Exam ${exam.id}`}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Candidate Email Addresses"
            name="emails"
            value={form.emails}
            onChange={updateField}
            placeholder="candidate@example.com, another@example.com"
            helperText="Separate multiple addresses with commas, spaces, or semicolons."
            multiline
            minRows={3}
            required
            fullWidth
          />

          {emailList.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {emailList.slice(0, 20).map((email, index) => (
                <Chip key={`${email}-${index}`} label={email} size="small" />
              ))}
              {emailList.length > 20 && (
                <Chip label={`+${emailList.length - 20} more`} size="small" />
              )}
            </Stack>
          )}

          <TextField
            select
            label="Invitation Role"
            name="role"
            value={form.role}
            onChange={updateField}
            fullWidth
          >
            <MenuItem value="STUDENT">Student / Candidate</MenuItem>
            <MenuItem value="EMPLOYEE">Employee / Evaluator</MenuItem>
          </TextField>

          <TextField
            label="Custom Message (Optional)"
            name="message"
            value={form.message}
            onChange={updateField}
            multiline
            minRows={4}
            fullWidth
          />

          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Invitations"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}