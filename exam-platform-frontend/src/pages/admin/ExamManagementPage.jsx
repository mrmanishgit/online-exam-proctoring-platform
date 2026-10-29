import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";

const demoExams = [
  {
    id: "EX-101",
    title: "Java Fundamentals Assessment",
    category: "Technical",
    questions: 40,
    duration: 60,
    candidates: 120,
    status: "Published",
  },
  {
    id: "EX-102",
    title: "Python Coding Challenge",
    category: "Coding",
    questions: 3,
    duration: 90,
    candidates: 85,
    status: "Scheduled",
  },
  {
    id: "EX-103",
    title: "Logical Reasoning Test",
    category: "Aptitude",
    questions: 50,
    duration: 45,
    candidates: 64,
    status: "Draft",
  },
  {
    id: "EX-104",
    title: "Database Management Assessment",
    category: "Technical",
    questions: 35,
    duration: 60,
    candidates: 98,
    status: "Completed",
  },
];

export default function ExamManagementPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const exams = useMemo(
    () =>
      demoExams.filter((exam) => {
        const matchesSearch = `${exam.title} ${exam.id} ${exam.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesSearch && (filter === "All" || exam.status === filter);
      }),
    [search, filter],
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "success";
      case "Scheduled":
        return "info";
      case "Completed":
        return "default";
      default:
        return "warning";
    }
  };

  return (
    <Box>
      <PageHeader
        title="Exam Management"
        subtitle="Create, organize, and manage online assessments."
        action={
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => navigate("/admin/exams/create")}
          >
            Create Exam
          </Button>
        }
      />

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search exams by title, ID, or category..."
            />

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {["All", "Draft", "Scheduled", "Published", "Completed"].map(
                (status) => (
                  <Chip
                    key={status}
                    label={status}
                    clickable
                    color={filter === status ? "primary" : "default"}
                    variant={filter === status ? "filled" : "outlined"}
                    onClick={() => setFilter(status)}
                  />
                ),
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {exams.map((exam) => (
          <Card key={exam.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {exam.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {exam.id} · {exam.category}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {exam.questions} questions · {exam.duration} minutes ·{" "}
                    {exam.candidates} candidates
                  </Typography>
                </Box>

                <Chip
                  label={exam.status}
                  color={getStatusColor(exam.status)}
                />

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityOutlined />}
                    onClick={() => navigate(`/admin/exams/${exam.id}/edit`)}
                  >
                    View
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<EditOutlined />}
                    onClick={() => navigate(`/admin/exams/${exam.id}/edit`)}
                  >
                    Edit
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {exams.length === 0 && (
          <EmptyState
            title="No examinations found"
            description="Try a different search term or status filter."
          />
        )}
      </Stack>
    </Box>
  );
}