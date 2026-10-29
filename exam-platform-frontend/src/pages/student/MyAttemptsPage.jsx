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
import { VisibilityOutlined, RefreshOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import StatusChip from "../../components/common/StatusChip";

const demoAttempts = [
  {
    id: "ATT-1001",
    examId: "EX-101",
    title: "Java Fundamentals Assessment",
    date: "2026-10-20T10:30:00",
    status: "Completed",
    score: 82,
  },
  {
    id: "ATT-1002",
    examId: "EX-102",
    title: "Logical Reasoning Test",
    date: "2026-10-22T14:00:00",
    status: "In Progress",
    score: null,
  },
  {
    id: "ATT-1003",
    examId: "EX-103",
    title: "Python Coding Challenge",
    date: "2026-10-24T09:00:00",
    status: "Submitted",
    score: null,
  },
];

export default function MyAttemptsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredAttempts = useMemo(() => {
    return demoAttempts.filter((attempt) => {
      const matchesSearch = `${attempt.title} ${attempt.id}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter = filter === "All" || attempt.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <Box>
      <PageHeader
        title="My Attempts"
        subtitle="Track your started, submitted, and completed examinations."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshOutlined />}
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
          >
            Reset filters
          </Button>
        }
      />

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Box sx={{ flex: 1 }}>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search attempts..."
              />
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {["All", "In Progress", "Submitted", "Completed"].map((status) => (
                <Chip
                  key={status}
                  label={status}
                  clickable
                  color={filter === status ? "primary" : "default"}
                  variant={filter === status ? "filled" : "outlined"}
                  onClick={() => setFilter(status)}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {filteredAttempts.map((attempt) => (
          <Card key={attempt.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {attempt.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Attempt ID: {attempt.id}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(attempt.date).toLocaleString()}
                  </Typography>
                </Box>

                <Stack spacing={1} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                  <StatusChip status={attempt.status} />

                  {attempt.score !== null && (
                    <Typography fontWeight={700}>
                      Demo score: {attempt.score}%
                    </Typography>
                  )}
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<VisibilityOutlined />}
                  onClick={() =>
                    navigate(`/student/exams/${attempt.examId}`)
                  }
                >
                  View Exam
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {filteredAttempts.length === 0 && (
          <EmptyState
            title="No attempts found"
            description="Try changing your search or status filter."
          />
        )}
      </Stack>
    </Box>
  );
}