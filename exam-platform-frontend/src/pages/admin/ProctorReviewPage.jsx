import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  CheckCircleRounded,
  FlagOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";

const initialEvents = [
  {
    id: "EVT-1001",
    candidate: "Candidate Two",
    exam: "Python Coding Challenge",
    type: "Multiple tab switches",
    time: "10:24 AM",
    severity: "High",
    status: "Pending Review",
  },
  {
    id: "EVT-1002",
    candidate: "Candidate Four",
    exam: "Java Fundamentals Assessment",
    type: "Face not detected",
    time: "10:31 AM",
    severity: "Medium",
    status: "Pending Review",
  },
  {
    id: "EVT-1003",
    candidate: "Candidate Five",
    exam: "Logical Reasoning Test",
    type: "Camera connection interrupted",
    time: "10:42 AM",
    severity: "Low",
    status: "Reviewed",
  },
];

export default function ProctorReviewPage() {
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const matchesSearch = `${event.id} ${event.candidate} ${event.exam} ${event.type}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesSearch && (filter === "All" || event.status === filter);
      }),
    [events, search, filter],
  );

  const markReviewed = (id) => {
    setEvents((previous) =>
      previous.map((event) =>
        event.id === id ? { ...event, status: "Reviewed" } : event,
      ),
    );
  };

  return (
    <Box>
      <PageHeader
        title="Proctoring Event Review"
        subtitle="Review monitoring alerts and record assessment decisions."
      />

      <Alert severity="warning" sx={{ mb: 3 }}>
        A monitoring alert is not proof of misconduct. Review available evidence
        and follow your institution's review and appeal procedures before
        taking action against a candidate.
      </Alert>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search event, candidate, or exam..."
            />

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {["All", "Pending Review", "Reviewed"].map((status) => (
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
        {filteredEvents.map((event) => (
          <Card key={event.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <FlagOutlined
                    color={event.severity === "High" ? "error" : "warning"}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700}>{event.type}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.candidate} · {event.exam}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.id} · {event.time}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    size="small"
                    label={event.severity}
                    color={
                      event.severity === "High"
                        ? "error"
                        : event.severity === "Medium"
                          ? "warning"
                          : "default"
                    }
                  />
                  <Chip
                    size="small"
                    label={event.status}
                    color={event.status === "Reviewed" ? "success" : "info"}
                  />
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityOutlined />}
                    onClick={() =>
                      window.alert(
                        "Connect this action to the proctoring evidence API.",
                      )
                    }
                  >
                    Evidence
                  </Button>

                  {event.status !== "Reviewed" && (
                    <Button
                      variant="contained"
                      startIcon={<CheckCircleRounded />}
                      onClick={() => markReviewed(event.id)}
                    >
                      Mark Reviewed
                    </Button>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {filteredEvents.length === 0 && (
          <EmptyState
            title="No proctoring events found"
            description="Try a different search term or review status."
          />
        )}
      </Stack>
    </Box>
  );
}