import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

export default function QuestionEditor({
  open,
  question,
  onClose,
  onSave,
  saving = false,
}) {
  const [form, setForm] = useState({
    text: "",
    type: "SINGLE_CHOICE",
    marks: 1,
    explanation: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        text: question?.text || question?.questionText || "",
        type: question?.type || "SINGLE_CHOICE",
        marks: Number(question?.marks ?? 1),
        explanation: question?.explanation || "",
      });
      setError("");
    }
  }, [open, question]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    if (!form.text.trim()) {
      setError("Question text is required.");
      return;
    }

    if (!Number.isFinite(form.marks) || form.marks <= 0) {
      setError("Marks must be greater than zero.");
      return;
    }

    setError("");
    onSave?.({
      ...question,
      ...form,
      questionText: form.text,
    });
  };

  return (
    <Dialog open={Boolean(open)} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{question ? "Edit question" : "Create question"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Question text"
            multiline
            minRows={3}
            fullWidth
            required
            value={form.text}
            onChange={(event) => update("text", event.target.value)}
          />

          <TextField
            select
            label="Question type"
            fullWidth
            value={form.type}
            onChange={(event) => update("type", event.target.value)}
          >
            <MenuItem value="SINGLE_CHOICE">Single choice</MenuItem>
            <MenuItem value="MULTIPLE_CHOICE">Multiple choice</MenuItem>
            <MenuItem value="TRUE_FALSE">True or false</MenuItem>
            <MenuItem value="SHORT_ANSWER">Short answer</MenuItem>
            <MenuItem value="CODING">Coding</MenuItem>
          </TextField>

          <TextField
            label="Marks"
            type="number"
            inputProps={{ min: 1 }}
            fullWidth
            value={form.marks}
            onChange={(event) => update("marks", Number(event.target.value))}
          />

          <TextField
            label="Explanation"
            multiline
            minRows={2}
            fullWidth
            value={form.explanation}
            onChange={(event) => update("explanation", event.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save question"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}