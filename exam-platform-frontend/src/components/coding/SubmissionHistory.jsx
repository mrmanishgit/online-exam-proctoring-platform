import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import EmptyState from "../common/EmptyState";

function getStatusColor(status) {
  const normalized = String(status || "").toLowerCase();

  if (["accepted", "passed", "success"].includes(normalized)) {
    return "success";
  }

  if (["pending", "queued", "running"].includes(normalized)) {
    return "warning";
  }

  if (["error", "failed", "wrong_answer", "rejected"].includes(normalized)) {
    return "error";
  }

  return "default";
}

export default function SubmissionHistory({
  submissions = [],
  onSelect,
  selectedId,
}) {
  if (!submissions.length) {
    return (
      <EmptyState
        title="No submissions yet"
        description="Your coding submissions will appear here."
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {submissions.map((submission, index) => {
        const id = submission.id ?? submission.submissionId ?? index;
        const status = submission.status || submission.verdict || "Submitted";
        const selected = selectedId === id;

        return (
          <Paper
            key={id}
            variant="outlined"
            onClick={() => onSelect?.(submission)}
            sx={{
              p: 2,
              borderRadius: 2,
              cursor: onSelect ? "pointer" : "default",
              borderColor: selected ? "primary.main" : "divider",
              bgcolor: selected ? "action.selected" : "background.paper",
              transition: "border-color 0.2s",
              "&:hover": onSelect
                ? { borderColor: "primary.main" }
                : undefined,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
                <HistoryRoundedIcon color="action" sx={{ mt: 0.25 }} />

                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={700}>
                    Submission #{submission.submissionId ?? id}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {submission.language || "Language not specified"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    {submission.createdAt
                      ? new Date(submission.createdAt).toLocaleString()
                      : "Date unavailable"}
                  </Typography>
                </Box>
              </Stack>

              <Chip
                size="small"
                label={String(status).replaceAll("_", " ")}
                color={getStatusColor(status)}
              />
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 1.5 }}
            >
              {submission.score !== undefined && (
                <Typography variant="caption" color="text.secondary">
                  Score: {submission.score}
                </Typography>
              )}

              {submission.executionTime !== undefined && (
                <Typography variant="caption" color="text.secondary">
                  Runtime: {submission.executionTime} ms
                </Typography>
              )}
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}