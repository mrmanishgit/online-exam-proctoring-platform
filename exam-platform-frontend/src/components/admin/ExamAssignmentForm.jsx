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
import { AssignmentInd } from "@mui/icons-material";

export default function ExamAssignmentForm({
  exams = [],
  candidates = [],
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    examId: "",
    candidateIds: [],
    dueDate: "",
    instructions: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.examId) {
      setError("Please select an exam.");
      return;
    }

    if (form.candidateIds.length === 0) {
      setError("Select at least one candidate.");
      return;
    }

    try {
      await onSubmit?.({
        examId: form.examId,
        candidateIds: form.candidateIds,
        dueDate: form.dueDate || null,
        instructions: form.instructions.trim(),
      });

      setSuccess("Exam assignment submitted successfully.");
      setForm({
        examId: "",
        candidateIds: [],
        dueDate: "",
        instructions: "",
      });
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Unable to assign the exam."
      );
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <AssignmentInd color="primary" fontSize="large" />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Assign Exam
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Assign an exam to one or more candidates.
          </Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            select
            label="Exam"
            name="examId"
            value={form.examId}
            onChange={handleChange}
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
            select
            label="Candidates"
            name="candidateIds"
            value={form.candidateIds}
            onChange={handleChange}
            SelectProps={{ multiple: true }}
            required
            fullWidth
            helperText="You can select multiple candidates."
          >
            {candidates.map((candidate) => (
              <MenuItem
                key={candidate.id}
                value={String(candidate.id)}
              >
                {candidate.name || candidate.fullName || candidate.email}
                {candidate.email ? ` — ${candidate.email}` : ""}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Assignment Due Date (Optional)"
            name="dueDate"
            type="datetime-local"
            value={form.dueDate}
            onChange={handleChange}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />

          <TextField
            label="Instructions (Optional)"
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            multiline
            minRows={3}
            fullWidth
          />

          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              startIcon={<AssignmentInd />}
              disabled={loading}
            >
              {loading ? "Assigning..." : "Assign Exam"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}