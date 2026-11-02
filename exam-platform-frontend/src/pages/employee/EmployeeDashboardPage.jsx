import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import { AssignmentOutlined, CheckCircleRounded, GroupsOutlined, ScheduleOutlined, ArrowForward } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import assignmentApi from "../../api/assignmentApi";
import { unwrapList } from "../../utils/apiResponse";

export default function EmployeeDashboardPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([assignmentApi.getAssignedByMe(), assignmentApi.getCandidateAttempts()])
      .then(([a, t]) => {
        if (!active) return;
        setAssignments(unwrapList(a));
        setAttempts(unwrapList(t));
      })
      .catch((e) => { if (active) setError(e?.response?.data?.message || "Unable to load employee workspace."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const pending = attempts.filter((a) => ["SUBMITTED", "COMPLETED", "PENDING_REVIEW"].includes(String(a.status).toUpperCase())).length;
  const reviewed = attempts.filter((a) => ["REVIEWED", "GRADED"].includes(String(a.status).toUpperCase())).length;
  const candidateCount = new Set(assignments.map((a) => a.studentId)).size;
  const stats = [
    { title: "Assigned Exams", value: assignments.length, description: "Assignments created by you", icon: AssignmentOutlined },
    { title: "Pending Reviews", value: pending, description: "Candidate attempts to review", icon: ScheduleOutlined },
    { title: "Reviewed Attempts", value: reviewed, description: "Attempts already reviewed", icon: CheckCircleRounded },
    { title: "Candidates", value: candidateCount, description: "Unique assigned students", icon: GroupsOutlined },
  ];

  return <Box>
    <PageHeader title="Employee Dashboard" subtitle="Manage your exam assignments and monitor candidate progress." />
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {loading ? <Loader /> : <>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat) => { const Icon = stat.icon; return <Grid key={stat.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card sx={{ height: "100%" }}><CardContent><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography color="text.secondary" variant="body2">{stat.title}</Typography><Typography variant="h4" fontWeight={800} mt={1}>{stat.value}</Typography></Box><Icon color="primary" /></Stack><Typography variant="caption" color="text.secondary" display="block" mt={2}>{stat.description}</Typography></CardContent></Card>
        </Grid>; })}
      </Grid>
      <Card><CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
          <Box><Typography variant="h6" fontWeight={700}>Your assigned assessments</Typography><Typography variant="body2" color="text.secondary">Live records from your account.</Typography></Box>
          <Button endIcon={<ArrowForward />} onClick={() => navigate("/employee/exams")}>View all assignments</Button>
        </Stack>
        <Stack spacing={2}>
          {assignments.slice(0, 8).map((row) => <Box key={row.id} sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
              <Box sx={{ flex: 1 }}><Typography fontWeight={700}>{row.examTitle}</Typography><Typography variant="body2" color="text.secondary">{row.studentFirstName} {row.studentLastName} · {row.studentEmail}</Typography></Box>
              <Chip size="small" label={row.status || "ASSIGNED"} />
            </Stack>
          </Box>)}
          {!assignments.length && <Alert severity="info">You have not assigned any exams yet.</Alert>}
        </Stack>
      </CardContent></Card>
    </>}
  </Box>;
}
