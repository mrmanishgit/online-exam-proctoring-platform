import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { EventAvailableOutlined, SaveOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import examApi from "../../api/examApi";
import { unwrapList } from "../../utils/apiResponse";

export default function ExamSchedulingPage() {
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await examApi.getExams();
    setExams(unwrapList({ data }));
    if (!examId && unwrapList({ data }).length) setExamId(String(unwrapList({ data })[0].id));
  };
  useEffect(() => { load().catch(e => setError(e.response?.data?.message || "Unable to load exams.")); }, []);

  const schedule = async (event) => {
    event.preventDefault(); setError(""); setNotice("");
    if (!start || !end || new Date(end) <= new Date(start)) { setError("Select a valid start and end time."); return; }
    setLoading(true);
    try {
      await examApi.scheduleExam(examId, { startTime: new Date(start).toISOString(), endTime: new Date(end).toISOString() });
      setNotice("Exam schedule saved to the database.");
      await load();
    } catch (e) { setError(e.response?.data?.message || "Unable to save exam schedule."); }
    finally { setLoading(false); }
  };

  const publish = async (id) => {
    try { await examApi.publishExam(id); setNotice("Exam published. Assigned students can access it during the scheduled window."); await load(); }
    catch (e) { setError(e.response?.data?.message || "Unable to publish exam. Check questions and schedule."); }
  };

  return <Box>
    <PageHeader title="Exam Scheduling" subtitle="Schedule exams and publish them when questions and timing are ready." />
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
    <Card sx={{ borderRadius: 3, mb: 3 }}><CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>Schedule an exam</Typography>
      <Box component="form" onSubmit={schedule}><Stack spacing={2}>
        <TextField select fullWidth label="Exam" value={examId} onChange={e => setExamId(e.target.value)} required>
          {exams.map(ex => <MenuItem key={ex.id} value={String(ex.id)}>{ex.title} · #{ex.id}</MenuItem>)}
        </TextField>
        <TextField fullWidth type="datetime-local" label="Start date and time" value={start} onChange={e => setStart(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} required />
        <TextField fullWidth type="datetime-local" label="End date and time" value={end} onChange={e => setEnd(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} required />
        <Button type="submit" variant="contained" startIcon={<SaveOutlined />} disabled={loading || !examId}>{loading ? "Saving..." : "Save schedule"}</Button>
      </Stack></Box>
    </CardContent></Card>
    <Typography variant="h6" fontWeight={700} mb={2}>Exam schedules</Typography>
    <Stack spacing={2}>{exams.map(ex => <Card key={ex.id}><CardContent>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
        <EventAvailableOutlined color="primary" />
        <Box sx={{ flex: 1 }}><Typography fontWeight={700}>{ex.title}</Typography>
          <Typography variant="body2" color="text.secondary">Start: {ex.startTime ? new Date(ex.startTime).toLocaleString() : "Not scheduled"}</Typography>
          <Typography variant="body2" color="text.secondary">End: {ex.endTime ? new Date(ex.endTime).toLocaleString() : "Not scheduled"}</Typography>
        </Box>
        <Chip label={ex.status || "DRAFT"} />
        <Button variant="outlined" onClick={() => publish(ex.id)} disabled={ex.status === "PUBLISHED" || !ex.startTime || !ex.endTime}>Publish</Button>
      </Stack>
    </CardContent></Card>)}</Stack>
  </Box>;
}
