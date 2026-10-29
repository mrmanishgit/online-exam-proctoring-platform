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
import { EventAvailable, ArrowBack } from "@mui/icons-material";

export default function ScheduleExamForm({
  initialValues = {},
  exams = [],
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState({
    examId: initialValues.examId || "",
    startDate: initialValues.startDate || "",
    endDate: initialValues.endDate || "",
    timezone: initialValues.timezone || "Asia/Kolkata",
    instructions: initialValues.instructions || "",
    ...initialValues,
  });

  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.examId) {
      setError("Please select an exam.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setError("Start and end dates are required.");
      return;
    }

    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setError("The end time must be later than the start time.");
      return;
    }

    try {
      await onSubmit?.({
        ...form,
        examId: String(form.examId),
      });
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Unable to schedule the exam."
      );
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        {onCancel && (
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onCancel}
          >
            Back
          </Button>
        )}

        <Box>
          <Typography variant="h5" fontWeight={700}>
            Schedule Exam
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Choose the exam and set its availability window.
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Select Exam"
            name="examId"
            value={form.examId}
            onChange={updateField}
            select
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
            label="Start Date and Time"
            name="startDate"
            type="datetime-local"
            value={form.startDate}
            onChange={updateField}
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
          />

          <TextField
            label="End Date and Time"
            name="endDate"
            type="datetime-local"
            value={form.endDate}
            onChange={updateField}
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
          />

          <TextField
            label="Timezone"
            name="timezone"
            value={form.timezone}
            onChange={updateField}
            select
            fullWidth
          >
            <MenuItem value="Asia/Kolkata">India Standard Time</MenuItem>
            <MenuItem value="UTC">UTC</MenuItem>
            <MenuItem value="Asia/Dubai">Gulf Standard Time</MenuItem>
            <MenuItem value="Europe/London">United Kingdom</MenuItem>
            <MenuItem value="America/New_York">US Eastern Time</MenuItem>
          </TextField>

          <TextField
            label="Candidate Instructions"
            name="instructions"
            value={form.instructions}
            onChange={updateField}
            multiline
            minRows={4}
            fullWidth
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              startIcon={<EventAvailable />}
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule Exam"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}