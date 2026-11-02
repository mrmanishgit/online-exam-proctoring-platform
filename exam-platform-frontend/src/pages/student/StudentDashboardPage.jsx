import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, Grid, Paper, Stack, Typography } from "@mui/material";
import { AssignmentRounded, ArrowForwardRounded, ScheduleRounded, EmojiEventsRounded } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import examApi from "../../api/examApi";
import attemptApi from "../../api/attemptApi";
import resultApi from "../../api/resultApi";
import { unwrapList } from "../../utils/apiResponse";
import useAuth from "../../hooks/useAuth";

export default function StudentDashboardPage() {
  const { user } = useAuth(); const [exams,setExams]=useState([]); const [attempts,setAttempts]=useState([]); const [results,setResults]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  useEffect(()=>{let active=true;Promise.all([examApi.getAvailableExams(),attemptApi.getMyAttempts(),resultApi.getMyResults()]).then(([e,a,r])=>{if(!active)return;setExams(unwrapList(e));setAttempts(unwrapList(a));setResults(unwrapList(r));}).catch(err=>{if(active)setError(err?.response?.data?.message||"Unable to load your dashboard from the backend.");}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
  const completed=attempts.filter(a=>["SUBMITTED","COMPLETED"].includes(String(a.status).toUpperCase())).length;
  const average=results.length?Math.round(results.reduce((sum,r)=>sum+Number(r.percentage||0),0)/results.length):0;
  const stats=[{label:"Available exams",value:exams.length,icon:AssignmentRounded},{label:"My attempts",value:attempts.length,icon:ScheduleRounded},{label:"Completed exams",value:completed,icon:EmojiEventsRounded},{label:"Average published score",value:`${average}%`,icon:EmojiEventsRounded}];
  return <Stack spacing={3}><PageHeader title={`Welcome back${user?.firstName?`, ${user.firstName}`:""}!`} subtitle="Your examination overview is loaded from your account."/>
    {error&&<Alert severity="error">{error}</Alert>}{loading?<Loader/>:<>
      <Grid container spacing={2.5}>{stats.map(s=>{const Icon=s.icon;return <Grid key={s.label} size={{xs:12,sm:6,xl:3}}><Paper variant="outlined" sx={{p:2.5,borderRadius:4}}><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography color="text.secondary" variant="body2">{s.label}</Typography><Typography variant="h4" fontWeight={850} mt={1}>{s.value}</Typography></Box><Icon color="primary"/></Stack></Paper></Grid>;})}</Grid>
      <Paper sx={{p:{xs:3,md:4},borderRadius:4,color:"white",background:"linear-gradient(120deg, #3730A3, #4F46E5 55%, #0284C7)"}}><Typography variant="overline">YOUR NEXT STEP</Typography><Typography variant="h4" fontWeight={850} mt={1}>Ready for your next challenge?</Typography><Typography sx={{opacity:.9,mt:1}}>Explore exams published by your administrator.</Typography><Button component={Link} to="/student/exams" variant="contained" endIcon={<ArrowForwardRounded/>} sx={{mt:3,bgcolor:"white",color:"#3730A3"}}>Explore exams</Button></Paper>
      <Box><Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Box><Typography variant="h5" fontWeight={800}>Available exams</Typography><Typography color="text.secondary">Published exams currently available.</Typography></Box><Button component={Link} to="/student/exams">View all</Button></Stack>
        {exams.length===0?<Alert severity="info">There are no published exams available for your account yet.</Alert>:<Stack spacing={2}>{exams.slice(0,5).map(exam=><Card key={exam.id} variant="outlined" sx={{borderRadius:3}}><CardContent><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={750}>{exam.title}</Typography><Typography variant="body2" color="text.secondary">{exam.subject||exam.examType} · {exam.durationMinutes} minutes</Typography></Box><Button component={Link} to={`/student/exams/${exam.id}`}>View exam</Button></Stack></CardContent></Card>)}</Stack>}</Box>
    </>}</Stack>;
}
