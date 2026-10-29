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
import { EventAvailableOutlined, SaveOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";

const demoSchedules = [
  {
    id: "SCH-101",
    exam: "Java Fundamentals Assessment",
    start: "2026-11-02T10:00",
    end: "2026-11-02T11:00",
    status: "Scheduled",
  },
  {
    id: "SCH-102",
    exam: "Python Coding Challenge",
    start: "2026-11-04T14:00",
    end: "2026-11-04T15:30",
    status: "Scheduled",
  },
];

export default function ExamSchedulingPage() {
  const [schedules, setSchedules] = useState(demoSchedules);
  const [examId, setExamId] = useState("EX-101");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const examOptions = useMemo(
    () => [
      { id: "EX-101", title: "Java Fundamentals Assessment" },
      { id: "EX-102", title: "Python Coding Challenge" },
      { id: "EX-103", title: "Logical Reasoning Test" },
    ],
    [],
  );

  const handleSchedule = (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!start || !end) {
      setError("Select both the start and end date/time.");
      return;
    }

    if (new Date(start) <= new Date()) {
      setError("The start date and time must be in the future.");
      return;
    }

    if (new Date(end) <= new Date(start)) {
      setError("The end time must be after the start time.");
      return;
    }

    const selectedExam = examOptions.find((exam) => exam.id === examId);

    const newSchedule = {
      id: `SCH-${Date.now()}`,
      exam: selectedExam?.title ?? examId,
      start,
      end,
      status: "Scheduled",
    };

    // Demo-only local update. Connect the scheduling API for persistence.
    setSchedules((previous) => [newSchedule, ...previous]);
    setNotice("Schedule added to the current demo page.");
    setStart("");
    setEnd("");
  };

  return (
    <Box>
      <PageHeader
        title="Exam Scheduling"
        subtitle="Configure examination dates and time windows."
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
            Create a schedule
          </Typography>

          <Box component="form" onSubmit={handleSchedule}>
            <Stack spacing={2.5}>
              <TextField
                select
                fullWidth
                label="Examination"
                value={examId}
                onChange={(event) => setExamId(event.target.value)}
              >
                {examOptions.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                type="datetime-local"
                label="Start date and time"
                value={start}
                onChange={(event) => setStart(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />

              <TextField
                fullWidth
                type="datetime-local"
                label="End date and time"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveOutlined />}
              >
                Save Schedule
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={700} mb={2}>
        Existing schedules
      </Typography>

      <Stack spacing={2}>
        {schedules.map((schedule) => (
          <Card key={schedule.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <EventAvailableOutlined color="primary" fontSize="large" />

                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700}>
                    {schedule.exam}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Start: {new Date(schedule.start).toLocaleString()}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    End: {new Date(schedule.end).toLocaleString()}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {schedule.id}
                  </Typography>
                </Box>

                <Chip label={schedule.status} color="success" />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}