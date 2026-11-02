import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardContent, Chip, Stack, Typography,
} from "@mui/material";
import { VisibilityOutlined, RefreshOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import StatusChip from "../../components/common/StatusChip";
import attemptApi from "../../api/attemptApi";
import { unwrapList } from "../../utils/apiResponse";

function normalizeStatus(value) {
  const status = String(value || "UNKNOWN").toUpperCase();
  if (status === "IN_PROGRESS" || status === "INPROGRESS") return "In Progress";
  if (status === "SUBMITTED") return "Submitted";
  if (status === "COMPLETED") return "Completed";
  if (status === "EVALUATED") return "Submitted";
  return status.replaceAll("_", " ");
}

function formatDate(value) {
  if (!value) return "Not started";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

export default function MyAttemptsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAttempts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const response = await attemptApi.getMyAttempts();
      const rows = unwrapList(response);
      setAttempts(rows.map((item) => ({
        id: item.id ?? item.attemptId,
        examId: item.examId ?? item.exam?.id,
        title: item.examTitle ?? item.exam?.title ?? "Exam",
        date: item.startedAt ?? item.createdAt ?? null,
        submittedAt: item.submittedAt ?? null,
        status: normalizeStatus(item.status),
        rawStatus: String(item.status || "").toUpperCase(),
        score: item.percentage ?? null,
        obtainedMarks: item.obtainedMarks ?? null,
        totalMarks: item.totalMarks ?? null,
      })));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load your attempts. Please try again.");
      setAttempts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAttempts();
  }, [loadAttempts]);

  const filteredAttempts = useMemo(() => attempts.filter((attempt) => {
    const matchesSearch = `${attempt.title} ${attempt.id ?? ""}`
      .toLowerCase().includes(search.trim().toLowerCase());
    const matchesFilter = filter === "All" || attempt.status === filter;
    return matchesSearch && matchesFilter;
  }), [attempts, search, filter]);

  return (
    <Box>
      <PageHeader
        title="My Attempts"
        subtitle="Track your started, submitted, and completed examinations."
        action={
          <Button variant="outlined" startIcon={<RefreshOutlined />}
            disabled={loading || refreshing} onClick={() => loadAttempts(true)}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}>
            <Box sx={{ flex: 1 }}>
              <SearchBar value={search} onChange={setSearch} placeholder="Search attempts..." />
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {["All", "In Progress", "Submitted", "Completed"].map((status) => (
                <Chip key={status} label={status} clickable
                  color={filter === status ? "primary" : "default"}
                  variant={filter === status ? "filled" : "outlined"}
                  onClick={() => setFilter(status)} />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {loading ? <Loader /> : filteredAttempts.length === 0 ? (
        <EmptyState
          title={attempts.length ? "No matching attempts" : "No attempts yet"}
          description={attempts.length
            ? "Try changing your search or status filter."
            : "Your real exam attempts will appear here after you start an assigned exam."}
        />
      ) : (
        <Stack spacing={2}>
          {filteredAttempts.map((attempt) => (
            <Card key={attempt.id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{attempt.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Attempt ID: {attempt.id ?? "Unavailable"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Started: {formatDate(attempt.date)}
                    </Typography>
                    {attempt.submittedAt && (
                      <Typography variant="body2" color="text.secondary">
                        Submitted: {formatDate(attempt.submittedAt)}
                      </Typography>
                    )}
                  </Box>
                  <Stack spacing={1} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                    <StatusChip status={attempt.rawStatus} />
                    {attempt.obtainedMarks != null && attempt.totalMarks != null && (
                      <Typography fontWeight={700}>
                        {attempt.obtainedMarks} / {attempt.totalMarks} marks
                      </Typography>
                    )}
                    {attempt.score != null && (
                      <Typography fontWeight={700}>{Number(attempt.score).toFixed(1)}%</Typography>
                    )}
                  </Stack>
                  <Button variant="outlined" startIcon={<VisibilityOutlined />}
                    disabled={!attempt.examId}
                    onClick={() => navigate(`/student/exams/${attempt.examId}`)}>
                    View Exam
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
