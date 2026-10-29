import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SaveOutlined, ArrowBack } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";

const initialForm = {
  title: "",
  description: "",
  category: "Technical",
  duration: 60,
  totalMarks: 100,
  passingMarks: 40,
  instructions: "",
  status: "Draft",
};

export default function CreateExamPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (Number(form.duration) <= 0) {
      setError("Duration must be greater than zero.");
      return;
    }

    if (Number(form.totalMarks) <= 0) {
      setError("Total marks must be greater than zero.");
      return;
    }

    if (Number(form.passingMarks) > Number(form.totalMarks)) {
      setError("Passing marks cannot exceed total marks.");
      return;
    }

    // Connect to the exam creation API before using this in production.
    window.alert(
      "The form is valid, but the exam creation API is not connected yet.",
    );
  };

  return (
    <Box>
      <PageHeader
        title="Create Examination"
        subtitle="Configure the basic details and rules for a new assessment."
        action={
          <Button
            startIcon={<ArrowBack />}
            variant="outlined"
            onClick={() => navigate("/admin/exams")}
          >
            Back to Exams
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, maxWidth: 900 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight={700}>
                Examination details
              </Typography>

              <TextField
                fullWidth
                required
                name="title"
                label="Exam title"
                value={form.title}
                onChange={updateField}
                inputProps={{ maxLength: 150 }}
              />

              <TextField
                fullWidth
                multiline
                minRows={3}
                name="description"
                label="Description"
                value={form.description}
                onChange={updateField}
              />

              <FormControl fullWidth>
                <InputLabel id="exam-category-label">Category</InputLabel>
                <Select
                  labelId="exam-category-label"
                  name="category"
                  value={form.category}
                  label="Category"
                  onChange={updateField}
                >
                  <MenuItem value="Technical">Technical</MenuItem>
                  <MenuItem value="Aptitude">Aptitude</MenuItem>
                  <MenuItem value="Coding">Coding</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                minRows={3}
                name="instructions"
                label="Candidate instructions"
                value={form.instructions}
                onChange={updateField}
                placeholder="Enter the instructions candidates should read before starting."
              />

              <Typography variant="h6" fontWeight={700}>
                Scoring and timing
              </Typography>

              <TextField
                fullWidth
                required
                type="number"
                name="duration"
                label="Duration (minutes)"
                value={form.duration}
                onChange={updateField}
                inputProps={{ min: 1, max: 600 }}
              />

              <TextField
                fullWidth
                required
                type="number"
                name="totalMarks"
                label="Total marks"
                value={form.totalMarks}
                onChange={updateField}
                inputProps={{ min: 1 }}
              />

              <TextField
                fullWidth
                required
                type="number"
                name="passingMarks"
                label="Passing marks"
                value={form.passingMarks}
                onChange={updateField}
                inputProps={{ min: 0 }}
              />

              <FormControl fullWidth>
                <InputLabel id="exam-status-label">Initial status</InputLabel>
                <Select
                  labelId="exam-status-label"
                  name="status"
                  value={form.status}
                  label="Initial status"
                  onChange={updateField}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                </Select>
              </FormControl>

              <Alert severity="info">
                Creating an exam does not automatically add questions, schedule
                candidates, or activate proctoring. Those features require
                their corresponding API workflows.
              </Alert>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveOutlined />}
                >
                  Save Examination
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setForm(initialForm)}
                >
                  Reset Form
                </Button>

                <Button onClick={() => navigate("/admin/exams")}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}