import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import EmptyState from "../common/EmptyState";

export default function LiveMonitoringPanel({
  sessions = [],
  onSelectSession,
}) {
  const activeSessions = sessions.filter(
    (session) =>
      !["completed", "submitted", "cancelled", "expired"].includes(
        String(session.status || "active").toLowerCase()
      )
  );

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <VideocamRoundedIcon color="primary" />
            <Typography variant="h6" fontWeight={800}>
              Live monitoring
            </Typography>
          </Stack>

          <Chip
            icon={<PeopleAltRoundedIcon />}
            label={`${activeSessions.length} active`}
            color="success"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {activeSessions.length ? (
          <Stack spacing={1.5}>
            {activeSessions.map((session, index) => {
              const id = session.id ?? session.attemptId ?? index;
              const alerts = session.flaggedEvents ?? session.alertCount ?? 0;
              const candidate =
                session.candidateName ||
                session.user?.name ||
                session.candidate?.name ||
                `Candidate ${index + 1}`;

              return (
                <Box
                  key={id}
                  onClick={() => onSelectSession?.(session)}
                  role={onSelectSession ? "button" : undefined}
                  tabIndex={onSelectSession ? 0 : undefined}
                  onKeyDown={(event) => {
                    if (
                      onSelectSession &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      onSelectSession(session);
                    }
                  }}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    cursor: onSelectSession ? "pointer" : "default",
                    "&:hover": onSelectSession
                      ? { borderColor: "primary.main", bgcolor: "action.hover" }
                      : undefined,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ sm: "center" }}
                    spacing={1.5}
                  >
                    <Box>
                      <Typography fontWeight={700}>{candidate}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.examTitle || session.exam?.title || "Assessment"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Attempt ID: {id}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        size="small"
                        label={session.status || "Active"}
                        color="success"
                      />

                      {Number(alerts) > 0 && (
                        <Chip
                          size="small"
                          icon={<WarningAmberRoundedIcon />}
                          label={`${alerts} alert${Number(alerts) === 1 ? "" : "s"}`}
                          color="warning"
                        />
                      )}
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <EmptyState
            title="No active sessions"
            description="Active candidate sessions will appear here when monitoring data is connected."
          />
        )}

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
          Live session data must be supplied by the backend or a monitoring connection.
        </Typography>
      </CardContent>
    </Card>
  );
}