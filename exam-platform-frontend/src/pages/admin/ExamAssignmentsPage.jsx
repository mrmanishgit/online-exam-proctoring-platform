import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { PersonAddAlt1Outlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import examApi from "../../api/examApi";
import userApi from "../../api/userApi";
import assignmentApi from "../../api/assignmentApi";
import { unwrapList } from "../../utils/apiResponse";

export default function ExamAssignmentsPage() {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [examId, setExamId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [examRes, studentRes, assignmentRes] = await Promise.all([
      examApi.getExams(), userApi.getStudents(), assignmentApi.getAssignedByMe()
    ]);
    const es = unwrapList(examRes), ss = unwrapList(studentRes), aa = unwrapList(assignmentRes);
    setExams(es); setStudents(ss); setAssignments(aa);
    if (!examId && es.length) setExamId(String(es[0].id));
    if (!studentId && ss.length) setStudentId(String(ss[0].id));
  };

  useEffect(() => { load().catch(e => setError(e.response?.data?.message || "Unable to load assignment data.")); }, []);

  const filtered = useMemo(() => assignments.filter(a => {
    const student = a.user || {};
    const exam = a.exam || {};
    return `${a.examTitle || ""} ${a.studentFirstName || ""} ${a.studentLastName || ""} ${a.studentEmail || ""} ${a.studentId || ""}`.toLowerCase().includes(search.toLowerCase());
  }), [assignments, search]);

  const submit = async event => {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    try {
      const response = await assignmentApi.assign({
        examId: Number(examId),
        userId: Number(studentId),
        dueAt: dueAt ? new Date(dueAt).toISOString() : null
      });
      const result = response.data?.data || response.data;
      setNotice(result.invitationEmailSent
        ? "Exam assigned and invitation email sent to the student."
        : `Exam assignment saved. Invitation email was not sent: ${result.invitationMessage || "Check SMTP settings."}`);
      setDueAt("");
      await load();
    } catch (e) { setError(e.response?.data?.message || "Unable to assign exam."); }
    finally { setLoading(false); }
  };

  return <Box>
    <PageHeader title="Exam Assignments" subtitle="Assign an exam to a registered student using their student ID. The signed-in employee is recorded as assigned by." />
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
    <Card sx={{ borderRadius: 3, mb: 3 }}><CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>Assign student</Typography>
      <Box component="form" onSubmit={submit}><Stack spacing={2}>
        <TextField select label="Exam" value={examId} onChange={e => setExamId(e.target.value)} required fullWidth>
          {exams.map(ex => <MenuItem key={ex.id} value={String(ex.id)}>{ex.title} · #{ex.id}</MenuItem>)}
        </TextField>
        <TextField select label="Student" value={studentId} onChange={e => setStudentId(e.target.value)} required fullWidth>
          {students.map(st => <MenuItem key={st.id} value={String(st.id)}>ID {st.id} — {st.firstName} {st.lastName} ({st.email})</MenuItem>)}
        </TextField>
        <TextField label="Due date (optional)" type="datetime-local" value={dueAt} onChange={e => setDueAt(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} fullWidth />
        <Button type="submit" variant="contained" startIcon={<PersonAddAlt1Outlined />} disabled={loading || !examId || !studentId}>{loading ? "Assigning..." : "Assign exam"}</Button>
      </Stack></Box>
    </CardContent></Card>
    <Card sx={{ borderRadius: 3, mb: 3 }}><CardContent><SearchBar value={search} onChange={setSearch} placeholder="Search student, email, ID or exam..." /></CardContent></Card>
    <Stack spacing={2}>{filtered.map(a => <Card key={a.id}><CardContent>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700}>{a.studentFirstName || ""} {a.studentLastName || ""} · Student ID {a.studentId}</Typography>
          <Typography variant="body2" color="text.secondary">{a.studentEmail}</Typography>
          <Typography variant="body2" mt={1}>{a.examTitle}</Typography>
          <Typography variant="caption" color="text.secondary">Assignment #{a.id} · Assigned by {a.assignedByEmail || "current employee"}</Typography>
        </Box>
        <Chip label={a.status || "ASSIGNED"} color="success" />
      </Stack>
    </CardContent></Card>)}
    {filtered.length === 0 && <EmptyState title="No assignments found" description="Assignments created by your account will appear here." />}
    </Stack>
  </Box>;
}
