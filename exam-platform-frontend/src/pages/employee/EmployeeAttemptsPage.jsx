import { useMemo, useState } from "react";
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

const demoAttempts = [
  {
    id: "ATT-501",
    candidate: "Candidate One",
    email: "candidate1@example.com",
    exam: "Java Programming Assessment",
    submittedAt: "2026-10-28 10:15",
    status: "Review Pending",
  },
  {
    id: "ATT-502",
    candidate: "Candidate Two",
    email: "candidate2@example.com",
    exam: "Python Coding Test",
    submittedAt: "2026-10-28 11:30",
    status: "Reviewed",
  },
  {
    id: "ATT-503",
    candidate: "Candidate Three",
    email: "candidate3@example.com",
    exam: "Database Fundamentals",
    submittedAt: "2026-10-27 14:00",
    status: "Review Pending",
  },
];

export default function EmployeeAttemptsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const attempts = useMemo(
    () =>
      demoAttempts.filter((attempt) => {
        const matchesSearch = `${attempt.id} ${attempt.candidate} ${attempt.exam}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesSearch && (filter === "All" || attempt.status === filter);
      }),
    [search, filter],
  );

  return (
    <Box>
      <PageHeader
        title="Candidate Attempts"
        subtitle="Review submitted attempts and monitor their assessment status."
      />

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search candidate, exam, or attempt ID..."
            />

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {["All", "Review Pending", "Reviewed"].map((item) => (
                <Chip
                  key={item}
                  label={item}
                  clickable
                  color={filter === item ? "primary" : "default"}
                  variant={filter === item ? "filled" : "outlined"}
                  onClick={() => setFilter(item)}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {attempts.map((attempt) => (
          <Card key={attempt.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700} variant="h6">
                    {attempt.candidate}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {attempt.email}
                  </Typography>

                  <Typography variant="body2" mt={1}>
                    {attempt.exam}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {attempt.id} · Submitted {attempt.submittedAt}
                  </Typography>
                </Box>

                <Chip
                  label={attempt.status}
                  color={
                    attempt.status === "Reviewed" ? "success" : "warning"
                  }
                />

                <Button
                  variant="outlined"
                  startIcon={<VisibilityOutlined />}
                  onClick={() => {
                    window.alert(
                      "Connect this action to the attempt review API.",
                    );
                  }}
                >
                  Review attempt
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {attempts.length === 0 && (
          <EmptyState
            title="No candidate attempts found"
            description="Try another search or status filter."
          />
        )}
      </Stack>
    </Box>
  );
}