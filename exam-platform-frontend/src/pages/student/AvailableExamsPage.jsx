import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SearchBar from "../../components/common/SearchBar";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import { Link } from "react-router-dom";
import examApi from "../../api/examApi";
import { unwrapList } from "../../utils/apiResponse";

export default function AvailableExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    let active = true;
    examApi.getAvailableExams().then((response) => { if (active) setExams(unwrapList(response)); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load exams from the backend."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filteredExams = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exams.filter((exam) => {
      const title = exam.title || exam.name || "";
      const description = exam.description || "";
      const subject = exam.subject || exam.category || "";
      return `${title} ${description} ${subject}`.toLowerCase().includes(q) && (category === "ALL" || subject === category);
    });
  }, [exams, search, category]);

  return (
    <Stack spacing={3}>
      <PageHeader title="Available exams" subtitle="Assessments retrieved from your examination server." />
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search assessments..." />
        <TextField select label="Subject" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ minWidth: { md: 200 } }}>
          <MenuItem value="ALL">All subjects</MenuItem>
          {[...new Set(exams.map((e) => e.subject || e.category).filter(Boolean))].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
        </TextField>
      </Stack>
      {loading ? <Loader /> : filteredExams.length === 0 ? <EmptyState title="No exams available" description="No matching exam records were returned by the backend." /> : (
        <Grid container spacing={2.5}>
          {filteredExams.map((exam) => { const id = exam.id; const status = String(exam.status || "UNKNOWN").toUpperCase(); return (
            <Grid key={id} size={{ xs: 12, md: 6, xl: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", borderRadius: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center"><Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: "action.hover", display: "grid", placeItems: "center" }}><AssignmentRoundedIcon /></Box><Chip label={status} size="small" /></Stack>
                <Typography variant="h6" fontWeight={800} mt={2}>{exam.title || exam.name || `Exam ${id}`}</Typography>
                <Typography color="text.secondary" variant="body2" mt={1} sx={{ flexGrow: 1 }}>{exam.description || "No description provided."}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={2}>
                  {(exam.subject || exam.category) && <Chip size="small" variant="outlined" label={exam.subject || exam.category} />}
                  {exam.durationMinutes != null && <Chip size="small" variant="outlined" label={`${exam.durationMinutes} min`} />}
                  {exam.totalMarks != null && <Chip size="small" variant="outlined" label={`${exam.totalMarks} marks`} />}
                </Stack>
                <Button component={Link} to={`/student/exams/${id}`} variant="contained" fullWidth sx={{ mt: 3 }} disabled={!id}>View exam</Button>
              </Paper>
            </Grid>
          ); })}
        </Grid>
      )}
    </Stack>
  );
}
