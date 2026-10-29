import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
} from "@mui/material";
import { Save, ArrowBack } from "@mui/icons-material";

const initialForm = {
  title: "",
  description: "",
  durationMinutes: 60,
  totalMarks: 100,
  passingMarks: 40,
  startDate: "",
  endDate: "",
  status: "DRAFT",
  shuffleQuestions: false,
  allowCalculator: false,
  negativeMarking: false,
  negativeMarks: 0,
  maxAttempts: 1,
};

export default function CreateExamForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState({
    ...initialForm,
    ...initialValues,
  });
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Exam title is required.");
      return;
    }

    if (Number(form.durationMinutes) <= 0) {
      setError("Duration must be greater than zero.");
      return;
    }

    if (Number(form.totalMarks) <= 0) {
      setError("Total marks must be greater than zero.");
      return;
    }

    if (
      Number(form.passingMarks) < 0 ||
      Number(form.passingMarks) > Number(form.totalMarks)
    ) {
      setError("Passing marks must be between zero and total marks.");
      return;
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      setError("End date must be after the start date.");
      return;
    }

    try {
      await onSubmit?.({
        ...form,
        durationMinutes: Number(form.durationMinutes),
        totalMarks: Number(form.totalMarks),
        passingMarks: Number(form.passingMarks),
        negativeMarks: Number(form.negativeMarks),
        maxAttempts: Number(form.maxAttempts),
      });
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Unable to save the exam."
      );
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 3 }}
      >
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
            {initialValues?.id ? "Edit Exam" : "Create Exam"}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Configure exam details, scheduling, and exam rules.
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
          <Typography variant="h6">Basic Information</Typography>

          <TextField
            label="Exam Title"
            name="title"
            value={form.title}
            onChange={updateField}
            required
            fullWidth
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={updateField}
            multiline
            minRows={3}
            fullWidth
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Duration (minutes)"
              name="durationMinutes"
              type="number"
              value={form.durationMinutes}
              onChange={updateField}
              inputProps={{ min: 1 }}
              required
            />

            <TextField
              label="Maximum Attempts"
              name="maxAttempts"
              type="number"
              value={form.maxAttempts}
              onChange={updateField}
              inputProps={{ min: 1 }}
              required
            />

            <TextField
              label="Total Marks"
              name="totalMarks"
              type="number"
              value={form.totalMarks}
              onChange={updateField}
              inputProps={{ min: 1 }}
              required
            />

            <TextField
              label="Passing Marks"
              name="passingMarks"
              type="number"
              value={form.passingMarks}
              onChange={updateField}
              inputProps={{ min: 0 }}
              required
            />

            <TextField
              label="Start Date and Time"
              name="startDate"
              type="datetime-local"
              value={form.startDate}
              onChange={updateField}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />

            <TextField
              label="End Date and Time"
              name="endDate"
              type="datetime-local"
              value={form.endDate}
              onChange={updateField}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />

            <TextField
              label="Exam Status"
              name="status"
              value={form.status}
              onChange={updateField}
              select
              fullWidth
            >
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="SCHEDULED">Scheduled</MenuItem>
              <MenuItem value="PUBLISHED">Published</MenuItem>
            </TextField>
          </Box>

          <Divider />

          <Typography variant="h6">Exam Settings</Typography>

          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  name="shuffleQuestions"
                  checked={Boolean(form.shuffleQuestions)}
                  onChange={updateField}
                />
              }
              label="Shuffle questions"
            />

            <FormControlLabel
              control={
                <Switch
                  name="allowCalculator"
                  checked={Boolean(form.allowCalculator)}
                  onChange={updateField}
                />
              }
              label="Allow calculator"
            />

            <FormControlLabel
              control={
                <Switch
                  name="negativeMarking"
                  checked={Boolean(form.negativeMarking)}
                  onChange={updateField}
                />
              }
              label="Enable negative marking"
            />

            {form.negativeMarking && (
              <TextField
                label="Marks deducted per incorrect answer"
                name="negativeMarks"
                type="number"
                value={form.negativeMarks}
                onChange={updateField}
                inputProps={{ min: 0, step: 0.25 }}
                sx={{ maxWidth: 350, mt: 1 }}
              />
            )}
          </Stack>

          <Divider />

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
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Exam"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}