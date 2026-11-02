import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { AssignmentOutlined, GroupsOutlined, QuizOutlined, TrendingUpOutlined, ArrowForward } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import adminApi from "../../api/adminApi";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; adminApi.getDashboardStats().then(r => { if (active) setData(r?.data ?? r); }).catch(e => { if (active) setError(e?.response?.data?.message || "Unable to load live dashboard metrics. Check ADMIN access and backend availability."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const stats = [
    { title: "Total Candidates", value: data?.totalCandidates ?? 0, icon: GroupsOutlined },
    { title: "Active Exams", value: data?.activeExams ?? 0, icon: QuizOutlined },
    { title: "Total Attempts", value: data?.totalAttempts ?? 0, icon: AssignmentOutlined },
    { title: "Completion Rate", value: `${data?.completionRate ?? 0}%`, icon: TrendingUpOutlined },
  ];
  const exams = data?.recentExams ?? [];
  return <Box><PageHeader title="Admin Dashboard" subtitle="Live platform metrics loaded from the backend." />
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {loading ? <Loader /> : <>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>{stats.map(s => { const Icon=s.icon; return <Grid key={s.title} size={{xs:12,sm:6,lg:3}}><Card sx={{borderRadius:3,height:"100%"}}><CardContent><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography variant="body2" color="text.secondary">{s.title}</Typography><Typography variant="h4" fontWeight={850} mt={1}>{s.value}</Typography></Box><Icon color="primary" /></Stack></CardContent></Card></Grid>; })}</Grid>
      <Card sx={{borderRadius:3}}><CardContent><Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Box><Typography variant="h6" fontWeight={800}>Recent Examinations</Typography><Typography color="text.secondary" variant="body2">Records returned by the exams database.</Typography></Box><Button onClick={()=>navigate("/admin/exams")} endIcon={<ArrowForward/>}>View all</Button></Stack>
        {exams.length===0 ? <Alert severity="info">No exams have been created yet.</Alert> : <Stack spacing={1.5}>{exams.slice(0,6).map(exam=><Card key={exam.id} variant="outlined"><CardContent sx={{py:1.5,"&:last-child":{pb:1.5}}}><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={700}>{exam.title}</Typography><Typography variant="caption" color="text.secondary">Exam #{exam.id} · {exam.examType || "Assessment"}</Typography></Box><Typography variant="body2">{exam.status}</Typography></Stack></CardContent></Card>)}</Stack>}
      </CardContent></Card>
      <Grid container spacing={2} sx={{mt:1}}>{[["Create Exam","Build a new assessment","/admin/exams/create"],["Manage Candidates","View candidate accounts","/admin/users"],["Live Monitoring","Review active sessions","/admin/monitoring"],["View Reports","Analyze assessment results","/admin/reports"]].map(([title,desc,path])=><Grid key={title} size={{xs:12,sm:6}}><Button fullWidth variant="outlined" onClick={()=>navigate(path)} sx={{p:2,justifyContent:"space-between"}}><Box textAlign="left"><Typography fontWeight={700}>{title}</Typography><Typography variant="caption" color="text.secondary">{desc}</Typography></Box><ArrowForward/></Button></Grid>)}</Grid>
    </>}
  </Box>;
}
