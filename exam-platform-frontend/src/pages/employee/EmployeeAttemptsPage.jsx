import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import assignmentApi from "../../api/assignmentApi";
import { unwrapList } from "../../utils/apiResponse";

export default function EmployeeAttemptsPage() {
 const [rows,setRows]=useState([]); const [search,setSearch]=useState(""); const [error,setError]=useState("");
 useEffect(()=>{assignmentApi.getCandidateAttempts().then(r=>setRows(unwrapList(r))).catch(e=>setError(e.response?.data?.message||"Unable to load candidate attempts."));},[]);
 const filtered=useMemo(()=>rows.filter(r=>`${r.id} ${r.examTitle} ${r.studentEmail} ${r.studentId}`.toLowerCase().includes(search.toLowerCase())),[rows,search]);
 return <Box><PageHeader title="Candidate Attempts" subtitle="Attempts submitted by students assigned by your employee account."/>
 {error&&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}<Card sx={{mb:3}}><CardContent><SearchBar value={search} onChange={setSearch} placeholder="Search candidate, exam or attempt..."/></CardContent></Card>
 <Stack spacing={2}>{filtered.map(r=><Card key={r.id}><CardContent><Stack direction={{xs:"column",sm:"row"}} spacing={2} alignItems={{sm:"center"}}><Box sx={{flex:1}}><Typography fontWeight={700}>Student ID {r.studentId}</Typography><Typography variant="body2" color="text.secondary">{r.studentEmail}</Typography><Typography variant="body2" mt={1}>{r.examTitle}</Typography><Typography variant="caption">Attempt #{r.id} · Started {r.startedAt}</Typography></Box><Chip label={r.status}/></Stack></CardContent></Card>)}{filtered.length===0&&<EmptyState title="No candidate attempts" description="Attempts from your assigned students will appear here."/>}</Stack></Box>;
}
