import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import assignmentApi from "../../api/assignmentApi";
import { unwrapList } from "../../utils/apiResponse";

export default function AssignedExamsPage() {
 const [rows,setRows]=useState([]); const [search,setSearch]=useState(""); const [error,setError]=useState("");
 useEffect(()=>{assignmentApi.getAssignedByMe().then(r=>setRows(unwrapList(r))).catch(e=>setError(e.response?.data?.message||"Unable to load assignments."));},[]);
 const filtered=useMemo(()=>rows.filter(r=>`${r.examTitle} ${r.studentFirstName} ${r.studentLastName} ${r.studentEmail} ${r.studentId}`.toLowerCase().includes(search.toLowerCase())),[rows,search]);
 return <Box><PageHeader title="Assigned Exams" subtitle="Exams assigned by your employee account to registered students."/>
 {error&&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}<Card sx={{mb:3}}><CardContent><SearchBar value={search} onChange={setSearch} placeholder="Search exam or student..."/></CardContent></Card>
 <Stack spacing={2}>{filtered.map(r=><Card key={r.id}><CardContent><Stack direction={{xs:"column",sm:"row"}} spacing={2} alignItems={{sm:"center"}}>
 <Box sx={{flex:1}}><Typography fontWeight={700}>{r.examTitle}</Typography><Typography variant="body2">Student: {r.studentFirstName} {r.studentLastName} · ID {r.studentId}</Typography><Typography variant="body2" color="text.secondary">{r.studentEmail}</Typography></Box><Chip label={r.status||"ASSIGNED"}/><Typography variant="caption">Assigned {r.assignedAt?new Date(r.assignedAt).toLocaleString():""}</Typography>
 </Stack></CardContent></Card>)}{filtered.length===0&&<EmptyState title="No assignments found" description="Assign a student to an exam to see it here."/>}</Stack></Box>;
}
