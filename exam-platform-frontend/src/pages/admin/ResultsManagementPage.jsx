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
import { DownloadOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import { downloadTextFile } from "../../utils/downloadUtils";

const demoResults = [
  {
    id: "RES-1001",
    candidate: "Candidate One",
    email: "candidate1@example.com",
    exam: "Java Fundamentals Assessment",
    score: 84,
    total: 100,
    status: "Passed",
  },
  {
    id: "RES-1002",
    candidate: "Candidate Two",
    email: "candidate2@example.com",
    exam: "Python Coding Challenge",
    score: 72,
    total: 100,
    status: "Passed",
  },
  {
    id: "RES-1003",
    candidate: "Candidate Three",
    email: "candidate3@example.com",
    exam: "Logical Reasoning Test",
    score: 38,
    total: 100,
    status: "Failed",
  },
];

export default function ResultsManagementPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const results = useMemo(
    () =>
      demoResults.filter((result) => {
        const matchesSearch = `${result.id} ${result.candidate} ${result.email} ${result.exam}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesSearch && (filter === "All" || result.status === filter);
      }),
    [search, filter],
  );

  const exportResults = () => {
    const rows = [
      ["Result ID", "Candidate", "Email", "Exam", "Score", "Total", "Status"],
      ...results.map((result) => [
        result.id,
        result.candidate,
        result.email,
        result.exam,
        result.score,
        result.total,
        result.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    downloadTextFile(csv, "exam-results.csv", "text/csv;charset=utf-8");
  };

  return (
    <Box>
      <PageHeader
        title="Results Management"
        subtitle="Review candidate scores and export examination results."
        action={
          <Button
            variant="contained"
            startIcon={<DownloadOutlined />}
            onClick={exportResults}
          >
            Export CSV
          </Button>
        }
      />

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search candidate, exam, or result ID..."
            />

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {["All", "Passed", "Failed"].map((status) => (
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
        {results.map((result) => (
          <Card key={result.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700} variant="h6">
                    {result.candidate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.email}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {result.exam}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {result.id}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    {result.score}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {result.score} / {result.total} marks
                  </Typography>
                </Box>

                <Chip
                  label={result.status}
                  color={result.status === "Passed" ? "success" : "error"}
                />

                <Button
                  variant="outlined"
                  onClick={() =>
                    window.alert(
                      "Connect this action to the detailed result API.",
                    )
                  }
                >
                  View Details
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {results.length === 0 && (
          <EmptyState
            title="No results found"
            description="Try another search or result filter."
          />
        )}
      </Stack>
    </Box>
  );
}