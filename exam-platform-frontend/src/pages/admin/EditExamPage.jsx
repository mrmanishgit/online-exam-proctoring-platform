import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const demoExam = {
  title: "Java Fundamentals Assessment",
  description: "Assessment covering core Java concepts.",
  category: "Technical",
  duration: 60,
  totalMarks: 100,
  passingMarks: 40,
  instructions: "Read each question carefully before answering.",
  status: "Published",
};

export default function EditExamPage() {
  const navigate = useNavigate();
  const { examId } = useParams();

  const [form, setForm] = useState(demoExam);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setNotice("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Exam title is required.");
      return;
    }

    if (Number(form.duration) <= 0) {
      setError("Duration must be greater than zero.");
      return;
    }

    if (
      Number(form.totalMarks) <= 0 ||
      Number(form.passingMarks) < 0 ||
      Number(form.passingMarks) > Number(form.totalMarks)
    ) {
      setError("Please enter valid total and passing marks.");
      return;
    }

    // Replace this with the exam update API.
    setNotice("Form validated. Connect the update API to save changes.");
  };

  return (
    <Box>
      <PageHeader
        title="Edit Examination"
        subtitle={`Update examination settings for ${examId || "the selected exam"}.`}
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {notice && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}

      <Card sx={{ maxWidth: 900, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight={700}>
                Examination settings
              </Typography>

              <TextField
                fullWidth
                required
                label="Exam title"
                name="title"
                value={form.title}
                onChange={updateField}
              />

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Description"
                name="description"
                value={form.description}
                onChange={updateField}
              />

              <FormControl fullWidth>
                <InputLabel id="edit-category-label">Category</InputLabel>
                <Select
                  labelId="edit-category-label"
                  label="Category"
                  name="category"
                  value={form.category}
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
                label="Candidate instructions"
                name="instructions"
                value={form.instructions}
                onChange={updateField}
              />

              <Typography variant="h6" fontWeight={700}>
                Scoring and duration
              </Typography>

              <TextField
                fullWidth
                type="number"
                label="Duration in minutes"
                name="duration"
                value={form.duration}
                onChange={updateField}
                inputProps={{ min: 1 }}
                required
              />

              <TextField
                fullWidth
                type="number"
                label="Total marks"
                name="totalMarks"
                value={form.totalMarks}
                onChange={updateField}
                inputProps={{ min: 1 }}
                required
              />

              <TextField
                fullWidth
                type="number"
                label="Passing marks"
                name="passingMarks"
                value={form.passingMarks}
                onChange={updateField}
                inputProps={{ min: 0 }}
                required
              />

              <FormControl fullWidth>
                <InputLabel id="edit-status-label">Exam status</InputLabel>
                <Select
                  labelId="edit-status-label"
                  label="Exam status"
                  name="status"
                  value={form.status}
                  onChange={updateField}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Published">Published</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>

              <Alert severity="warning">
                The initial values are demonstration data. Load the actual
                examination using its ID before enabling production updates.
              </Alert>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveOutlined />}
                >
                  Save Changes
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setForm(demoExam)}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}