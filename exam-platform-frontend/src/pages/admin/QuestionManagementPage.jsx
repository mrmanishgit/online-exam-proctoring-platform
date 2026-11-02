import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography, Chip } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import examApi from "../../api/examApi";
import questionApi from "../../api/questionApi";
import { unwrapList } from "../../utils/apiResponse";

export default function QuestionManagementPage() {
 const [params]=useSearchParams(); const [exams,setExams]=useState([]); const [examId,setExamId]=useState(params.get("examId")||"");
 const [questions,setQuestions]=useState([]); const [search,setSearch]=useState(""); const [text,setText]=useState(""); const [type,setType]=useState("MCQ"); const [marks,setMarks]=useState(1); const [opts,setOpts]=useState(["","","",""]); const [correct,setCorrect]=useState(0); const [error,setError]=useState(""); const [notice,setNotice]=useState(""); const [loading,setLoading]=useState(false);
 const loadExams=async()=>{const r=await examApi.getExams();const list=unwrapList(r);setExams(list);if(!examId&&list.length)setExamId(String(list[0].id));};
 const loadQuestions=async(id)=>{if(!id){setQuestions([]);return;}const r=await questionApi.getQuestionsByExam(id);setQuestions(unwrapList(r));};
 useEffect(()=>{loadExams().catch(e=>setError(e.response?.data?.message||"Unable to load exams."));},[]);
 useEffect(()=>{if(examId)loadQuestions(examId).catch(e=>setError(e.response?.data?.message||"Unable to load questions."));},[examId]);
 const filtered=useMemo(()=>questions.filter(q=>(q.questionText||"").toLowerCase().includes(search.toLowerCase())),[questions,search]);
 const add=async e=>{e.preventDefault();setError("");setNotice("");if(!text.trim()){setError("Enter question text.");return;}if(type==="MCQ"&&(opts.filter(x=>x.trim()).length<2)){setError("Enter at least two options.");return;}setLoading(true);try{await questionApi.createQuestionForExam(examId,{questionText:text.trim(),questionType:type,marks:Number(marks),displayOrder:questions.length+1,required:true,options:type==="MCQ"?opts.map((optionText,i)=>({optionText,correct:i===correct})).filter(o=>o.optionText.trim()):[]});setText("");setOpts(["","","",""]);setCorrect(0);setNotice("Question and options saved to the database.");await loadQuestions(examId);}catch(e){setError(e.response?.data?.message||"Unable to save question.");}finally{setLoading(false);}};
 const remove=async id=>{if(!window.confirm("Delete this question?"))return;try{await questionApi.deleteQuestion(id);await loadQuestions(examId);setNotice("Question deleted.");}catch(e){setError(e.response?.data?.message||"Unable to delete question.");}};
 return <Box><PageHeader title="Question Management" subtitle="Add questions and answer options to an exam before publishing."/>
 {error&&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}{notice&&<Alert severity="success" sx={{mb:2}}>{notice}</Alert>}
 <Card sx={{mb:3}}><CardContent><Stack spacing={2}><TextField select label="Exam" value={examId} onChange={e=>setExamId(e.target.value)}>{exams.map(x=><MenuItem key={x.id} value={String(x.id)}>{x.title} · #{x.id}</MenuItem>)}</TextField><TextField label="Question" multiline minRows={2} value={text} onChange={e=>setText(e.target.value)} required/><Stack direction={{xs:"column",sm:"row"}} spacing={2}><TextField select label="Question type" value={type} onChange={e=>setType(e.target.value)} sx={{minWidth:180}}><MenuItem value="MCQ">Multiple choice</MenuItem><MenuItem value="DESCRIPTIVE">Descriptive</MenuItem></TextField><TextField label="Marks" type="number" value={marks} onChange={e=>setMarks(e.target.value)} sx={{width:130}}/></Stack>{type==="MCQ"&&opts.map((o,i)=><Stack key={i} direction="row" spacing={1} alignItems="center"><TextField fullWidth label={`Option ${i+1}`} value={o} onChange={e=>setOpts(old=>old.map((v,j)=>j===i?e.target.value:v))}/><Button variant={correct===i?"contained":"outlined"} onClick={()=>setCorrect(i)}>Correct</Button></Stack>)}<Button onClick={add} variant="contained" startIcon={<AddOutlined/>} disabled={loading||!examId}>{loading?"Saving...":"Add question"}</Button></Stack></CardContent></Card>
 <Card sx={{mb:2}}><CardContent><SearchBar value={search} onChange={setSearch} placeholder="Search questions..."/></CardContent></Card><Stack spacing={2}>{filtered.map(q=><Card key={q.id}><CardContent><Stack direction={{xs:"column",sm:"row"}} spacing={2} alignItems={{sm:"center"}}><Box sx={{flex:1}}><Typography variant="caption">Question #{q.id}</Typography><Typography fontWeight={700}>{q.questionText}</Typography><Typography variant="body2" color="text.secondary">{q.questionType} · {q.marks} marks · {q.options?.length||0} options</Typography></Box><Button color="error" onClick={()=>remove(q.id)}>Delete</Button></Stack></CardContent></Card>)}{filtered.length===0&&<EmptyState title="No questions found" description="Select an exam and add its first question."/>}</Stack></Box>;
}
