import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Mail, SendOutlined, ReplayOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import examApi from "../../api/examApi";
import invitationApi from "../../api/invitationApi";
import { unwrapList } from "../../utils/apiResponse";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [examId, setExamId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [inv, ex] = await Promise.all([invitationApi.getInvitations(), examApi.getExams()]);
    setInvitations(unwrapList(inv));
    setExams(unwrapList(ex));
    if (!examId && unwrapList(ex).length) setExamId(String(unwrapList(ex)[0].id));
  };

  useEffect(() => { load().catch(e => setError(e.response?.data?.message || "Unable to load invitations.")); }, []);

  const filtered = useMemo(() => invitations.filter(i =>
    `${i.email || ""} ${i.exam?.title || i.examTitle || ""} ${i.status || ""}`.toLowerCase().includes(search.toLowerCase())
  ), [invitations, search]);

  const create = async (event) => {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    try {
      const response = await invitationApi.createInvitation({ examId: Number(examId), email: email.trim().toLowerCase() });
      const data = response.data || {};
      setNotice(data.emailSent ? "Invitation saved and email sent successfully." : (data.message || "Invitation saved, but email delivery failed."));
      setEmail("");
      await load();
    } catch (e) { setError(e.response?.data?.message || "Unable to create invitation."); }
    finally { setLoading(false); }
  };

  const resend = async (id) => {
    setError(""); setNotice("");
    try {
      const { data } = await invitationApi.resendInvitation(id);
      setNotice(data.emailSent ? "Invitation email sent successfully." : data.message);
      await load();
    } catch (e) { setError(e.response?.data?.message || "Unable to resend invitation."); }
  };

  const revoke = async (id) => {
    if (!window.confirm("Revoke this invitation?")) return;
    try { await invitationApi.revokeInvitation(id); setNotice("Invitation revoked."); await load(); }
    catch (e) { setError(e.response?.data?.message || "Unable to revoke invitation."); }
  };

  return <Box>
    <PageHeader title="Exam Invitations" subtitle="Create and track invitations stored by the backend and sent by email." />
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {notice && <Alert severity="info" sx={{ mb: 2 }}>{notice}</Alert>}
    <Card sx={{ borderRadius: 3, mb: 3 }}><CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>Create invitation</Typography>
      <Box component="form" onSubmit={create}><Stack spacing={2}>
        <TextField select fullWidth label="Exam" value={examId} onChange={e => setExamId(e.target.value)} required>
          {exams.map(ex => <MenuItem key={ex.id} value={String(ex.id)}>{ex.title}</MenuItem>)}
        </TextField>
        <TextField fullWidth type="email" label="Candidate email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Button type="submit" variant="contained" startIcon={<SendOutlined />} disabled={loading || !examId}>{loading ? "Sending..." : "Send invitation"}</Button>
      </Stack></Box>
    </CardContent></Card>
    <Card sx={{ borderRadius: 3, mb: 3 }}><CardContent><SearchBar value={search} onChange={setSearch} placeholder="Search invitations..." /></CardContent></Card>
    <Stack spacing={2}>
      {filtered.map(i => <Card key={i.id} sx={{ borderRadius: 3 }}><CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
          <Mail color="primary" fontSize="large" />
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700}>{i.email}</Typography>
            <Typography variant="body2">{i.exam?.title || i.examTitle || `Exam #${i.examId || i.exam?.id}`}</Typography>
            <Typography variant="caption" color="text.secondary">Invitation #{i.id} · {i.createdAt ? new Date(i.createdAt).toLocaleString() : ""}</Typography>
          </Box>
          <Chip label={i.status || "PENDING"} color={String(i.status).toUpperCase() === "ACCEPTED" ? "success" : "warning"} />
          <Button variant="outlined" startIcon={<ReplayOutlined />} onClick={() => resend(i.id)} disabled={i.status === "ACCEPTED" || i.status === "REVOKED"}>Resend</Button>
          <Button color="error" onClick={() => revoke(i.id)} disabled={i.status === "ACCEPTED" || i.status === "REVOKED"}>Revoke</Button>
        </Stack>
      </CardContent></Card>)}
      {filtered.length === 0 && <EmptyState title="No invitations found" description="Create an invitation to begin." />}
    </Stack>
  </Box>;
}
