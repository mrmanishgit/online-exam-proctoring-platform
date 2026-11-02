import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { AddOutlined, EditOutlined, VisibilityOutlined, DeleteOutline } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import examApi from "../../api/examApi";
import { unwrapList } from "../../utils/apiResponse";

export default function ExamManagementPage() {
 const navigate=useNavigate(); const [exams,setExams]=useState([]); const [search,setSearch]=useState(""); const [filter,setFilter]=useState("All"); const [error,setError]=useState("");
 const load=()=>examApi.getExams().then(r=>setExams(unwrapList(r))).catch(e=>setError(e.response?.data?.message||"Unable to load exams from backend."));
 useEffect(()=>{load();},[]);
 const filtered=useMemo(()=>exams.filter(x=>{const status=String(x.status||"DRAFT").toUpperCase();return `${x.title} ${x.id} ${x.subject||""}`.toLowerCase().includes(search.toLowerCase())&&(filter==="All"||status===filter.toUpperCase());}),[exams,search,filter]);
 const remove=async id=>{if(!window.confirm("Delete this exam and its related data if permitted?"))return;try{await examApi.deleteExam(id);await load();}catch(e){setError(e.response?.data?.message||"Unable to delete exam." )}};
 const color=s=>s==="PUBLISHED"?"success":s==="SCHEDULED"?"info":s==="CANCELLED"?"error":"warning";
 return <Box><PageHeader title="Exam Management" subtitle="Exams loaded from the ExamPilot database." action={<Button variant="contained" startIcon={<AddOutlined/>} onClick={()=>navigate("/admin/exams/create")}>Create Exam</Button>}/>
 {error&&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}<Card sx={{mb:3}}><CardContent><Stack spacing={2}><SearchBar value={search} onChange={setSearch} placeholder="Search exams..."/><Stack direction="row" spacing={1} flexWrap="wrap">{["All","Draft","Scheduled","Published","Cancelled"].map(v=><Chip key={v} label={v} clickable color={filter===v?"primary":"default"} variant={filter===v?"filled":"outlined"} onClick={()=>setFilter(v)}/>)}</Stack></Stack></CardContent></Card>
 <Stack spacing={2}>{filtered.map(x=><Card key={x.id}><CardContent><Stack direction={{xs:"column",md:"row"}} spacing={2} alignItems={{md:"center"}}><Box sx={{flex:1}}><Typography variant="h6" fontWeight={700}>{x.title}</Typography><Typography variant="body2" color="text.secondary">#{x.id} · {x.subject||x.examType} · {x.durationMinutes} minutes · {x.totalMarks} marks</Typography><Typography variant="caption" color="text.secondary">{x.startTime?new Date(x.startTime).toLocaleString():"Not scheduled"} {x.endTime?"– "+new Date(x.endTime).toLocaleString():""}</Typography></Box><Chip label={String(x.status||"DRAFT").toUpperCase()} color={color(String(x.status||"DRAFT").toUpperCase())}/><Stack direction="row" spacing={1}><Button size="small" variant="outlined" startIcon={<VisibilityOutlined/>} onClick={()=>navigate(`/admin/questions?examId=${x.id}`)}>Questions</Button><Button size="small" variant="outlined" startIcon={<EditOutlined/>} onClick={()=>navigate(`/admin/exams/${x.id}/edit`)}>Edit</Button><Button size="small" color="error" startIcon={<DeleteOutline/>} onClick={()=>remove(x.id)}>Delete</Button></Stack></Stack></CardContent></Card>)}{filtered.length===0&&<EmptyState title="No exams found" description="Create an exam to start building your assessment."/>}</Stack></Box>;
}
