import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import { DownloadOutlined, EmojiEventsOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import resultApi from "../../api/resultApi";
import { unwrapList } from "../../utils/apiResponse";
import { downloadTextFile } from "../../utils/downloadUtils";

export default function MyResultsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    resultApi.getMyResults()
      .then((response) => {
        if (!active) return;
        setRows(unwrapList(response).map((item) => ({
          id: item.resultId ?? item.id,
          examId: item.examId ?? item.examAttempt?.exam?.id,
          attemptId: item.attemptId ?? item.examAttempt?.id,
          title: item.examTitle ?? item.examAttempt?.exam?.title ?? "Exam",
          date: item.publishedAt ?? item.createdAt ?? null,
          score: Number(item.percentage ?? 0),
          obtained: Number(item.obtainedMarks ?? 0),
          total: Number(item.totalMarks ?? 0),
          status: item.passed === true ? "PASSED"
            : item.passed === false ? "FAILED"
            : String(item.status || "PUBLISHED").toUpperCase(),
          passed: item.passed,
        })));
      })
      .catch((err) => {
        if (active) setError(err?.response?.data?.message || "Unable to load published results from the backend.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const results = useMemo(() => rows.filter((item) =>
    `${item.title} ${item.id ?? ""}`.toLowerCase().includes(search.trim().toLowerCase())
  ), [rows, search]);

  const average = rows.length
    ? Math.round(rows.reduce((sum, item) => sum + item.score, 0) / rows.length)
    : 0;
  const passed = rows.filter((item) => item.passed === true
    || ["PASS", "PASSED"].includes(item.status)).length;

  const exportResults = () => {
    const lines = [
      "Result ID,Exam,Published,Percentage,Obtained,Total,Status",
      ...results.map((item) => [
        item.id,
        `"${String(item.title).replaceAll('"', '""')}"`,
        item.date ? new Date(item.date).toISOString() : "",
        item.score, item.obtained, item.total, item.status,
      ].join(",")),
    ];
    downloadTextFile(lines.join("\\n"), "my-exam-results.csv", "text/csv;charset=utf-8");
  };

  return (
    <Box>
      <PageHeader title="My Results"
        subtitle="Only results published by your administrator are shown."
        action={<Button variant="outlined" startIcon={<DownloadOutlined />}
          onClick={exportResults} disabled={!results.length}>Export CSV</Button>} />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          ["Published assessments", rows.length],
          ["Average score", `${average}%`],
          ["Passed assessments", passed],
        ].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 3 }}><CardContent>
              <Typography color="text.secondary" variant="body2">{label}</Typography>
              <Typography variant="h4" fontWeight={800} mt={1}>{value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent><SearchBar value={search} onChange={setSearch}
          placeholder="Search results by exam name or result ID..." /></CardContent>
      </Card>
      {loading ? <Loader /> : results.length === 0 ? (
        <EmptyState title="No published results"
          description="A submitted attempt appears in My Attempts. Your result appears here after an administrator publishes it." />
      ) : (
        <Stack spacing={2}>
          {results.map((item) => (
            <Card key={item.id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Result #{item.id} · {item.date ? new Date(item.date).toLocaleDateString() : "Date unavailable"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>{item.score.toFixed(1)}%</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.obtained} / {item.total} marks
                    </Typography>
                  </Box>
                  <Chip icon={<EmojiEventsOutlined />} label={item.status}
                    color={item.passed === true || item.status === "PASSED" ? "success"
                      : item.passed === false || item.status === "FAILED" ? "error" : "default"} />
                  {item.examId && (
                    <Button variant="outlined" startIcon={<VisibilityOutlined />}
                      onClick={() => navigate(`/student/exams/${item.examId}`)}>View Exam</Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
