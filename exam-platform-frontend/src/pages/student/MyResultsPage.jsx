import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  DownloadOutlined,
  EmojiEventsOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import { downloadTextFile } from "../../utils/downloadUtils";

const demoResults = [
  {
    id: "RES-2001",
    examId: "EX-101",
    title: "Java Fundamentals Assessment",
    date: "2026-10-20",
    score: 82,
    totalMarks: 100,
    result: "Passed",
  },
  {
    id: "RES-2002",
    examId: "EX-104",
    title: "SQL Knowledge Test",
    date: "2026-10-18",
    score: 68,
    totalMarks: 100,
    result: "Passed",
  },
  {
    id: "RES-2003",
    examId: "EX-105",
    title: "Data Structures Assessment",
    date: "2026-10-15",
    score: 42,
    totalMarks: 100,
    result: "Failed",
  },
];

export default function MyResultsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const results = useMemo(
    () =>
      demoResults.filter((item) =>
        `${item.title} ${item.id}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const averageScore = demoResults.length
    ? Math.round(
        demoResults.reduce((sum, item) => sum + item.score, 0) /
          demoResults.length,
      )
    : 0;

  const exportResults = () => {
    const header = "Result ID,Exam,Date,Score,Total Marks,Result";
    const rows = results.map((item) =>
      [
        item.id,
        `"${item.title.replaceAll('"', '""')}"`,
        item.date,
        item.score,
        item.totalMarks,
        item.result,
      ].join(","),
    );

    downloadTextFile(
      [header, ...rows].join("\n"),
      "my-exam-results.csv",
      "text/csv;charset=utf-8",
    );
  };

  return (
    <Box>
      <PageHeader
        title="My Results"
        subtitle="Review your assessment scores and outcomes."
        action={
          <Button
            variant="outlined"
            startIcon={<DownloadOutlined />}
            onClick={exportResults}
          >
            Export CSV
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Completed assessments
              </Typography>
              <Typography variant="h4" fontWeight={800} mt={1}>
                {demoResults.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Average demo score
              </Typography>
              <Typography variant="h4" fontWeight={800} mt={1}>
                {averageScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Passed assessments
              </Typography>
              <Typography variant="h4" fontWeight={800} mt={1}>
                {demoResults.filter((item) => item.result === "Passed").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search results by exam name or result ID..."
          />
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {results.map((result) => (
          <Card key={result.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {result.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {result.id} · {result.date}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    {result.score}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {result.score} / {result.totalMarks} marks
                  </Typography>
                </Box>

                <Chip
                  icon={<EmojiEventsOutlined />}
                  label={result.result}
                  color={result.result === "Passed" ? "success" : "error"}
                />

                <Button
                  variant="outlined"
                  startIcon={<VisibilityOutlined />}
                  onClick={() => navigate(`/student/exams/${result.examId}`)}
                >
                  View Exam
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {results.length === 0 && (
          <EmptyState
            title="No results found"
            description="Try another search term."
          />
        )}
      </Stack>
    </Box>
  );
}