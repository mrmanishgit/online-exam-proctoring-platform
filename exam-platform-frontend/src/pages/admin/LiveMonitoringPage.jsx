import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardContent, Chip, Grid, Stack, Typography,
} from "@mui/material";
import { VideocamOutlined, VisibilityOutlined, RefreshOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import proctoringApi from "../../api/proctoringApi";
import { unwrapList } from "../../utils/apiResponse";

function displayTime(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

export default function LiveMonitoringPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadSessions = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const response = await proctoringApi.getLiveSessions();
      setSessions(unwrapList(response));
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load active sessions. Check your Admin token and backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
    const timer = window.setInterval(() => loadSessions(), 10000);
    return () => window.clearInterval(timer);
  }, [loadSessions]);

  const filtered = useMemo(() => sessions.filter((s) => {
    const text = `${s.studentName || ""} ${s.studentEmail || ""} ${s.examTitle || ""} ${s.attemptId || ""}`.toLowerCase();
    const matches = text.includes(search.toLowerCase());
    const flagged = Number(s.flaggedEvents || 0) > 0;
    return matches && (filter === "All" || (filter === "Flagged" ? flagged : !flagged));
  }), [sessions, search, filter]);

  const flaggedCount = sessions.filter((s) => Number(s.flaggedEvents || 0) > 0).length;

  return (
    <Box>
      <PageHeader title="Live Exam Monitoring" subtitle="Active exam attempts loaded from the backend. Refreshes automatically every 10 seconds."
        action={<Button variant="outlined" startIcon={<RefreshOutlined />} disabled={refreshing} onClick={() => loadSessions(true)}>Refresh</Button>} />
      <Alert severity="info" sx={{ mb: 3 }}>
        This page displays active attempts and recorded proctoring events. It does not display webcam or screen video. Video review requires a separately configured, consent-based secure media service.
      </Alert>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[["Active Sessions", sessions.length], ["Flagged Sessions", flaggedCount], ["Unflagged Sessions", sessions.length - flaggedCount]].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 4 }}>
            <Card><CardContent><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="h4" fontWeight={800} mt={1}>{value}</Typography></CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ mb: 3 }}><CardContent><Stack spacing={2}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search student, exam, or attempt ID..." />
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {["All", "Flagged", "Unflagged"].map((v) => <Chip key={v} label={v} clickable color={filter === v ? "primary" : "default"} variant={filter === v ? "filled" : "outlined"} onClick={() => setFilter(v)} />)}
        </Stack>
      </Stack></CardContent></Card>
      {loading ? <Loader /> : <Stack spacing={2}>
        {filtered.map((session) => (
          <Card key={session.attemptId}><CardContent><Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
            <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: "action.hover", display: "grid", placeItems: "center" }}><VideocamOutlined color="primary" fontSize="large" /></Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700}>{session.studentName || "Student"}</Typography>
              <Typography variant="body2" color="text.secondary">{session.studentEmail || "No email"}</Typography>
              <Typography variant="body2" mt={1}>{session.examTitle || "Exam"}</Typography>
              <Typography variant="caption" color="text.secondary">Attempt #{session.attemptId} · Started {displayTime(session.startedAt)}</Typography>
            </Box>
            <Stack spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
              <Chip label="In Progress" color="success" />
              <Typography variant="caption" color="text.secondary">{Number(session.flaggedEvents || 0)} unreviewed events</Typography>
            </Stack>
            <Button variant="outlined" startIcon={<VisibilityOutlined />} onClick={() => navigate(`/admin/proctor-review?attemptId=${session.attemptId}`)}>Review Session</Button>
          </Stack></CardContent></Card>
        ))}
        {!filtered.length && <EmptyState title="No active sessions" description="Students who start an assigned exam will appear here. No demo sessions are shown." />}
      </Stack>}
    </Box>
  );
}
