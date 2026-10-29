import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  VideocamOutlined,
  VisibilityOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";

const demoSessions = [
  {
    id: "SES-1001",
    candidate: "Candidate One",
    email: "candidate1@example.com",
    exam: "Java Fundamentals Assessment",
    startedAt: "10:05 AM",
    status: "In Progress",
    events: 0,
  },
  {
    id: "SES-1002",
    candidate: "Candidate Two",
    email: "candidate2@example.com",
    exam: "Python Coding Challenge",
    startedAt: "10:12 AM",
    status: "Flagged",
    events: 2,
  },
  {
    id: "SES-1003",
    candidate: "Candidate Three",
    email: "candidate3@example.com",
    exam: "Logical Reasoning Test",
    startedAt: "10:20 AM",
    status: "In Progress",
    events: 0,
  },
];

export default function LiveMonitoringPage() {
  const [sessions] = useState(demoSessions);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredSessions = useMemo(
    () =>
      sessions.filter((session) => {
        const matchesSearch = `${session.candidate} ${session.email} ${session.exam} ${session.id}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesSearch && (filter === "All" || session.status === filter);
      }),
    [sessions, search, filter],
  );

  const activeCount = sessions.filter(
    (session) => session.status === "In Progress",
  ).length;

  const flaggedCount = sessions.filter(
    (session) => session.status === "Flagged",
  ).length;

  return (
    <Box>
      <PageHeader
        title="Live Exam Monitoring"
        subtitle="Monitor active examination sessions and review flagged candidates."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshOutlined />}
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
          >
            Reset Filters
          </Button>
        }
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        This page displays sample sessions only. Real-time monitoring requires
        backend session data, authorized media streams, and a WebSocket or
        equivalent live event connection.
      </Alert>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Active Sessions
              </Typography>
              <Typography variant="h4" fontWeight={800} mt={1}>
                {activeCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Flagged Sessions
              </Typography>
              <Typography variant="h4" fontWeight={800} mt={1}>
                {flaggedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Demo Sessions
              </Typography>
              <Typography variant="h4" fontWeight={800} mt={1}>
                {sessions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search candidate, exam, or session ID..."
            />

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {["All", "In Progress", "Flagged"].map((status) => (
                <Chip
                  key={status}
                  label={status}
                  clickable
                  color={filter === status ? "primary" : "default"}
                  variant={filter === status ? "filled" : "outlined"}
                  onClick={() => setFilter(status)}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {filteredSessions.map((session) => (
          <Card key={session.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <VideocamOutlined color="primary" fontSize="large" />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700}>
                    {session.candidate}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {session.email}
                  </Typography>

                  <Typography variant="body2" mt={1}>
                    {session.exam}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {session.id} · Started {session.startedAt}
                  </Typography>
                </Box>

                <Stack spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                  <Chip
                    label={session.status}
                    color={session.status === "Flagged" ? "warning" : "success"}
                  />

                  <Typography variant="caption" color="text.secondary">
                    {session.events} flagged events
                  </Typography>
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<VisibilityOutlined />}
                  onClick={() =>
                    window.alert(
                      "Connect this action to the authorized session monitoring API.",
                    )
                  }
                >
                  Review Session
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {filteredSessions.length === 0 && (
          <EmptyState
            title="No sessions found"
            description="Try changing the search or status filter."
          />
        )}
      </Stack>
    </Box>
  );
}