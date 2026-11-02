import { useEffect, useState } from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import invitationApi from "../../api/invitationApi";
import useAuth from "../../hooks/useAuth";

export default function InvitationAcceptPage() {
  const [params] = useSearchParams(); const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [message, setMessage] = useState("Checking invitation..."); const [error, setError] = useState("");
  useEffect(() => {
    const token = params.get("token");
    if (!token) { setError("Invitation token is missing."); return; }
    if (!isAuthenticated) { setMessage("Sign in or register with the email address that received this invitation, then open this invitation link again."); return; }
    if (user?.role !== "STUDENT") { setError("Only a student account can accept an exam invitation."); return; }
    invitationApi.acceptInvitation(token).then(() => setMessage("Invitation accepted. Your assigned exam will appear in Available Exams when it is published and scheduled."))
      .catch(e => setError(e.response?.data?.message || "Unable to accept invitation."));
  }, [params, isAuthenticated, user?.role]);
  return <Box sx={{ maxWidth: 620, mx: "auto", p: 3 }}><Paper sx={{ p: 4, borderRadius: 3 }}><Stack spacing={2}>
    <Typography variant="h5" fontWeight={700}>Exam invitation</Typography>
    {error ? <Alert severity="error">{error}</Alert> : <Alert severity={message.startsWith("Invitation accepted") ? "success" : "info"}>{message}</Alert>}
    {!isAuthenticated && <Stack direction="row" spacing={2}><Button component={Link} to="/login" variant="contained">Sign in</Button><Button component={Link} to="/register" variant="outlined">Register</Button></Stack>}
    {isAuthenticated && !error && message.startsWith("Invitation accepted") && <Button variant="contained" onClick={() => navigate("/student/exams")}>Open Available Exams</Button>}
  </Stack></Paper></Box>;
}
