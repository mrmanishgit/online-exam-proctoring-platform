import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { CheckCircleRounded, FlagOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import proctoringApi from "../../api/proctoringApi";
import { unwrapList } from "../../utils/apiResponse";

export default function ProctorReviewPage() {
  const [params] = useSearchParams();
  const attemptId = params.get("attemptId");
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      const response = attemptId
        ? await proctoringApi.getEventsByAttempt(attemptId)
        : await proctoringApi.getEvents();
      setEvents(unwrapList(response));
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load proctoring events.");
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [attemptId]);

  async function markReviewed(id) {
    setBusyId(id);
    try {
      await proctoringApi.reviewEvent(id);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to mark event as reviewed.");
    } finally { setBusyId(null); }
  }

  const filtered = useMemo(() => events.filter((event) => {
    const text = `${event.id} ${event.studentName || ""} ${event.studentEmail || ""} ${event.examTitle || ""} ${event.eventType || ""} ${event.description || ""}`.toLowerCase();
    const reviewed = Boolean(event.reviewed);
    return text.includes(search.toLowerCase())
      && (filter === "All" || (filter === "Reviewed" ? reviewed : !reviewed));
  }), [events, search, filter]);

  return <Box>
    <PageHeader title="Proctoring Event Review" subtitle={attemptId ? `Reviewing events for attempt #${attemptId}` : "Review recorded proctoring events from student exam attempts."}
      action={<Button variant="outlined" onClick={() => load()}>Refresh</Button>} />
    <Alert severity="warning" sx={{ mb: 3 }}>A monitoring alert is not proof of misconduct. Review available evidence and follow your institution's review and appeal procedures before taking action.</Alert>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Card sx={{ mb: 3 }}><CardContent><Stack spacing={2}>
      <SearchBar value={search} onChange={setSearch} placeholder="Search event, candidate, or exam..." />
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>{["All", "Pending Review", "Reviewed"].map((v) => <Chip key={v} label={v} clickable color={filter === v ? "primary" : "default"} variant={filter === v ? "filled" : "outlined"} onClick={() => setFilter(v)} />)}</Stack>
    </Stack></CardContent></Card>
    {loading ? <Loader /> : <Stack spacing={2}>
      {filtered.map((event) => <Card key={event.id}><CardContent><Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: "action.hover", display: "grid", placeItems: "center" }}><FlagOutlined color={String(event.severity).toUpperCase() === "HIGH" ? "error" : "warning"} /></Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700}>{event.eventType || "Proctoring event"}</Typography>
          <Typography variant="body2" color="text.secondary">{event.studentName || event.studentEmail || "Student"} · {event.examTitle || "Exam"}</Typography>
          <Typography variant="body2">{event.description || "No additional details"}</Typography>
          <Typography variant="caption" color="text.secondary">Event #{event.id} · Attempt #{event.attemptId} · {event.occurredAt ? new Date(event.occurredAt).toLocaleString() : "Time unavailable"}</Typography>
        </Box>
        <Stack direction="row" spacing={1}><Chip size="small" label={event.severity || "MEDIUM"} color={String(event.severity).toUpperCase() === "HIGH" ? "error" : String(event.severity).toUpperCase() === "MEDIUM" ? "warning" : "default"} /><Chip size="small" label={event.reviewed ? "Reviewed" : "Pending Review"} color={event.reviewed ? "success" : "info"} /></Stack>
        {!event.reviewed && <Button variant="contained" disabled={busyId === event.id} startIcon={<CheckCircleRounded />} onClick={() => markReviewed(event.id)}>Mark Reviewed</Button>}
      </Stack></CardContent></Card>)}
      {!filtered.length && <EmptyState title="No proctoring events" description="Events submitted by active student attempts will appear here." />}
    </Stack>}
  </Box>;
}
