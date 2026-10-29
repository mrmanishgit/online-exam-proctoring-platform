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
import { VisibilityOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";

const demoAssignments = [
  {
    id: "EX-301",
    title: "Java Programming Assessment",
    category: "Technical",
    candidates: 42,
    date: "2026-11-02",
    status: "Scheduled",
  },
  {
    id: "EX-302",
    title: "Database Fundamentals",
    category: "Technical",
    candidates: 36,
    date: "2026-11-04",
    status: "Scheduled",
  },
  {
    id: "EX-303",
    title: "Python Coding Test",
    category: "Coding",
    candidates: 28,
    date: "2026-10-30",
    status: "Review Pending",
  },
  {
    id: "EX-304",
    title: "Logical Reasoning",
    category: "Aptitude",
    candidates: 50,
    date: "2026-10-25",
    status: "Completed",
  },
];

export default function AssignedExamsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredAssignments = useMemo(
    () =>
      demoAssignments.filter((exam) => {
        const matchesSearch = `${exam.title} ${exam.id} ${exam.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return (
          matchesSearch && (status === "All" || exam.status === status)
        );
      }),
    [search, status],
  );

  const statusColor = (value) => {
    if (value === "Completed") return "success";
    if (value === "Review Pending") return "warning";
    return "primary";
  };

  return (
    <Box>
      <PageHeader
        title="Assigned Exams"
        subtitle="View and manage assessments assigned to your employee account."
      />

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search exams..."
            />

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {["All", "Scheduled", "Review Pending", "Completed"].map(
                (item) => (
                  <Chip
                    key={item}
                    label={item}
                    clickable
                    color={status === item ? "primary" : "default"}
                    variant={status === item ? "filled" : "outlined"}
                    onClick={() => setStatus(item)}
                  />
                ),
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {filteredAssignments.map((exam) => (
          <Card key={exam.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {exam.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {exam.id} · {exam.category} · {exam.candidates} candidates
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Scheduled date: {exam.date}
                  </Typography>
                </Box>

                <Chip
                  label={exam.status}
                  color={statusColor(exam.status)}
                />

                <Button
                  variant="outlined"
                  startIcon={<VisibilityOutlined />}
                  onClick={() => navigate("/employee/attempts")}
                >
                  View attempts
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {filteredAssignments.length === 0 && (
          <EmptyState
            title="No assigned exams found"
            description="Change the search term or status filter."
          />
        )}
      </Stack>
    </Box>
  );
}