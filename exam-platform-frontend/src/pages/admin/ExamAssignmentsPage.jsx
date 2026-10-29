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
//import { PersonAddAlt1Outlined, DeleteOutline } from "@mui/icons-material";
import { PersonAddAlt1Outlined, Delete } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";

const initialAssignments = [
  {
    id: "ASN-101",
    exam: "Java Fundamentals Assessment",
    candidate: "Aarav Sharma",
    email: "aarav@example.com",
    status: "Assigned",
  },
  {
    id: "ASN-102",
    exam: "Python Coding Challenge",
    candidate: "Priya Das",
    email: "priya@example.com",
    status: "Invited",
  },
  {
    id: "ASN-103",
    exam: "Logical Reasoning Test",
    candidate: "Rahul Kumar",
    email: "rahul@example.com",
    status: "Completed",
  },
];

const examOptions = [
  "Java Fundamentals Assessment",
  "Python Coding Challenge",
  "Logical Reasoning Test",
];

export default function ExamAssignmentsPage() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [search, setSearch] = useState("");
  const [exam, setExam] = useState(examOptions[0]);
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredAssignments = useMemo(
    () =>
      assignments.filter((assignment) =>
        `${assignment.exam} ${assignment.candidate} ${assignment.email}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [assignments, search],
  );

  const assignCandidate = (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!candidateName.trim() || !email.trim()) {
      setError("Enter the candidate name and email address.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const duplicate = assignments.some(
      (item) =>
        item.exam === exam &&
        item.email.toLowerCase() === normalizedEmail,
    );

    if (duplicate) {
      setError("This candidate is already assigned to the selected exam.");
      return;
    }

    setAssignments((previous) => [
      {
        id: `ASN-${Date.now()}`,
        exam,
        candidate: candidateName.trim(),
        email: normalizedEmail,
        status: "Assigned",
      },
      ...previous,
    ]);

    setCandidateName("");
    setEmail("");
    setNotice("Assignment added to the local demo list. No invitation was sent.");
  };

  const removeAssignment = (id) => {
    if (!window.confirm("Remove this assignment from the demo list?")) return;

    setAssignments((previous) => previous.filter((item) => item.id !== id));
    setNotice("Assignment removed from the current demo list.");
  };

  return (
    <Box>
      <PageHeader
        title="Exam Assignments"
        subtitle="Assign candidates to examinations and review their assignment status."
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
            Assign a candidate
          </Typography>

          <Box component="form" onSubmit={assignCandidate}>
            <Stack spacing={2}>
              <TextField
                select
                fullWidth
                label="Examination"
                value={exam}
                onChange={(event) => setExam(event.target.value)}
              >
                {examOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Candidate name"
                value={candidateName}
                onChange={(event) => setCandidateName(event.target.value)}
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

              <Button
                type="submit"
                variant="contained"
                startIcon={<PersonAddAlt1Outlined />}
              >
                Assign Candidate
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
            placeholder="Search assignments..."
          />
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700}>
                    {assignment.candidate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {assignment.email}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {assignment.exam}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {assignment.id}
                  </Typography>
                </Box>

                <Chip
                  label={assignment.status}
                  color={
                    assignment.status === "Completed"
                      ? "success"
                      : assignment.status === "Invited"
                        ? "info"
                        : "primary"
                  }
                />

                <Button
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => removeAssignment(assignment.id)}
                >
                  Remove
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {filteredAssignments.length === 0 && (
          <EmptyState
            title="No assignments found"
            description="Try a different search term or assign a candidate."
          />
        )}
      </Stack>
    </Box>
  );
}