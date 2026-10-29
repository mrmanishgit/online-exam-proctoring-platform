import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SearchBar from "../../components/common/SearchBar";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Link } from "react-router-dom";

const demoExams = [
  { id: "EX-101", title: "Java Programming Assessment", category: "Programming", duration: 60, questions: 30, status: "AVAILABLE", description: "Test your Java fundamentals, object-oriented programming, and problem-solving skills." },
  { id: "EX-102", title: "Database Fundamentals", category: "Technical", duration: 45, questions: 25, status: "AVAILABLE", description: "Evaluate SQL queries, relational database concepts, joins, and normalization." },
  { id: "EX-103", title: "Logical Reasoning Test", category: "Aptitude", duration: 30, questions: 20, status: "AVAILABLE", description: "Practice analytical thinking, patterns, sequences, and logical reasoning." },
  { id: "EX-104", title: "Python Coding Challenge", category: "Programming", duration: 90, questions: 4, status: "UPCOMING", description: "Solve coding problems using Python and validate your solutions against test cases." },
  { id: "EX-105", title: "Web Development Basics", category: "Technical", duration: 40, questions: 25, status: "AVAILABLE", description: "Review HTML, CSS, JavaScript, and fundamental web development concepts." },
];

export default function AvailableExamsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();

    return demoExams.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(query) ||
        exam.description.toLowerCase().includes(query);

      const matchesCategory = category === "ALL" || exam.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Available exams"
        subtitle="Discover assessments and review their details before starting."
      />

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search assessments..." />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          sx={{ minWidth: { md: 200 } }}
        >
          <MenuItem value="ALL">All categories</MenuItem>
          <MenuItem value="Programming">Programming</MenuItem>
          <MenuItem value="Technical">Technical</MenuItem>
          <MenuItem value="Aptitude">Aptitude</MenuItem>
        </TextField>
      </Stack>

      <Grid container spacing={2.5}>
        {filteredExams.map((exam) => (
          <Grid key={exam.id} size={{ xs: 12, md: 6, xl: 4 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                transition: "transform .2s, box-shadow .2s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 5 },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: "#EEF2FF", color: "#4F46E5", display: "grid", placeItems: "center" }}>
                  <AssignmentRoundedIcon />
                </Box>
                <Chip
                  label={exam.status === "AVAILABLE" ? "Available" : "Upcoming"}
                  color={exam.status === "AVAILABLE" ? "success" : "warning"}
                  size="small"
                />
              </Stack>

              <Typography variant="h6" fontWeight={800} mt={2}>
                {exam.title}
              </Typography>

              <Typography color="text.secondary" variant="body2" mt={1} sx={{ flexGrow: 1 }}>
                {exam.description}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={2}>
                <Chip size="small" variant="outlined" label={exam.category} />
                <Chip size="small" variant="outlined" label={`${exam.duration} min`} />
                <Chip size="small" variant="outlined" label={`${exam.questions} questions`} />
              </Stack>

              <Button
                component={Link}
                to={`/student/exams/${exam.id}`}
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
              >
                View exam
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {filteredExams.length === 0 && (
        <EmptyState
          title="No exams found"
          description="Try changing your search text or selecting another category."
        />
      )}

      <Box>
        <Typography variant="caption" color="text.secondary">
          Demo assessments are sample data. Live examination availability will be loaded from the backend when integrated.
        </Typography>
      </Box>
    </Stack>
  );
}