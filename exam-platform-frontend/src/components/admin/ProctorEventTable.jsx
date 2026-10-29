import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EmptyState from "../common/EmptyState";

function getSeverityColor(severity) {
  const normalized = String(severity || "").toLowerCase();

  if (["critical", "high"].includes(normalized)) return "error";
  if (["medium", "warning"].includes(normalized)) return "warning";
  if (["low", "info"].includes(normalized)) return "info";

  return "default";
}

export default function ProctorEventTable({
  events = [],
  loading = false,
  onSelect,
}) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {events.map((event, index) => {
              const id = event.id ?? event.eventId ?? index;
              const severity = event.severity || "Info";

              return (
                <TableRow
                  hover={Boolean(onSelect)}
                  key={id}
                  onClick={() => onSelect?.(event)}
                  sx={{ cursor: onSelect ? "pointer" : "default" }}
                >
                  <TableCell>
                    {event.candidateName ||
                      event.candidate?.name ||
                      event.user?.name ||
                      "Unknown candidate"}
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>
                      {event.eventType || event.type || "Proctoring event"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.description || event.message || "No additional details"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={severity}
                      color={getSeverityColor(severity)}
                    />
                  </TableCell>

                  <TableCell>
                    {event.createdAt || event.timestamp
                      ? new Date(event.createdAt || event.timestamp).toLocaleString()
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={event.reviewStatus || event.status || "Unreviewed"}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {!loading && events.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    title="No proctoring events"
                    description="Events will appear when proctoring records are available."
                  />
                </TableCell>
              </TableRow>
            )}

            {loading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography textAlign="center" sx={{ py: 3 }}>
                    Loading proctoring events...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}