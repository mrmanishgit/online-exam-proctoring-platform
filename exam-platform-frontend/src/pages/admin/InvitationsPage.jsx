import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Mail,
  SendOutlined,
  ReplayOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";

const initialInvitations = [
  {
    id: "INV-101",
    candidate: "Aarav Sharma",
    email: "aarav@example.com",
    exam: "Java Fundamentals Assessment",
    sentAt: "2026-10-26",
    status: "Sent",
  },
  {
    id: "INV-102",
    candidate: "Priya Das",
    email: "priya@example.com",
    exam: "Python Coding Challenge",
    sentAt: "2026-10-25",
    status: "Accepted",
  },
  {
    id: "INV-103",
    candidate: "Rahul Kumar",
    email: "rahul@example.com",
    exam: "Logical Reasoning Test",
    sentAt: "2026-10-24",
    status: "Pending",
  },
];

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [search, setSearch] = useState("");
  const [candidate, setCandidate] = useState("");
  const [email, setEmail] = useState("");
  const [exam, setExam] = useState("Java Fundamentals Assessment");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredInvitations = useMemo(
    () =>
      invitations.filter((item) =>
        `${item.candidate} ${item.email} ${item.exam} ${item.id}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [invitations, search],
  );

  const sendInvitation = (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!candidate.trim() || !normalizedEmail) {
      setError("Enter the candidate name and email.");
      return;
    }

    if (
      invitations.some(
        (item) =>
          item.email.toLowerCase() === normalizedEmail &&
          item.exam === exam,
      )
    ) {
      setError("An invitation already exists for this candidate and exam.");
      return;
    }

    setInvitations((previous) => [
      {
        id: `INV-${Date.now()}`,
        candidate: candidate.trim(),
        email: normalizedEmail,
        exam,
        sentAt: new Date().toISOString().slice(0, 10),
        status: "Pending",
      },
      ...previous,
    ]);

    setCandidate("");
    setEmail("");
    setNotice(
      "Invitation added to the local demo list. No email was actually sent.",
    );
  };

  const retryInvitation = (id) => {
    setInvitations((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: "Pending" } : item,
      ),
    );
    setNotice("Invitation reset locally. Connect the email API to resend it.");
  };

  return (
    <Box>
      <PageHeader
        title="Exam Invitations"
        subtitle="Manage candidate invitations and track invitation status."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {notice && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={700} mb={3}>
            Create invitation
          </Typography>

          <Box component="form" onSubmit={sendInvitation}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Candidate name"
                value={candidate}
                onChange={(event) => setCandidate(event.target.value)}
                required
              />

              <TextField
                fullWidth
                type="email"
                label="Candidate email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <TextField
                select
                fullWidth
                label="Examination"
                value={exam}
                onChange={(event) => setExam(event.target.value)}
              >
                <option value="Java Fundamentals Assessment">
                  Java Fundamentals Assessment
                </option>
                <option value="Python Coding Challenge">
                  Python Coding Challenge
                </option>
                <option value="Logical Reasoning Test">
                  Logical Reasoning Test
                </option>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                startIcon={<SendOutlined />}
              >
                Create Invitation
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search invitations..."
          />
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {filteredInvitations.map((invitation) => (
          <Card key={invitation.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Mail color="primary" fontSize="large" />

                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700}>
                    {invitation.candidate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {invitation.email}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {invitation.exam}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {invitation.id} · Created {invitation.sentAt}
                  </Typography>
                </Box>

                <Chip
                  label={invitation.status}
                  color={
                    invitation.status === "Accepted"
                      ? "success"
                      : invitation.status === "Pending"
                        ? "warning"
                        : "info"
                  }
                />

                {invitation.status !== "Accepted" && (
                  <Button
                    variant="outlined"
                    startIcon={<ReplayOutlined />}
                    onClick={() => retryInvitation(invitation.id)}
                  >
                    Retry
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}

        {filteredInvitations.length === 0 && (
          <EmptyState
            title="No invitations found"
            description="Try another search term or create an invitation."
          />
        )}
      </Stack>
    </Box>
  );
}