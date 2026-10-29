import { Grid, Paper, Stack, Typography } from "@mui/material";
import {
  EmojiEvents,
  TrendingUp,
  CheckCircle,
  People,
} from "@mui/icons-material";

const summaryItems = [
  {
    key: "totalCandidates",
    label: "Total Candidates",
    icon: People,
    color: "#1976d2",
  },
  {
    key: "averageScore",
    label: "Average Score",
    icon: TrendingUp,
    color: "#7b1fa2",
    suffix: "%",
  },
  {
    key: "passRate",
    label: "Pass Rate",
    icon: CheckCircle,
    color: "#2e7d32",
    suffix: "%",
  },
  {
    key: "topScore",
    label: "Highest Score",
    icon: EmojiEvents,
    color: "#ed6c02",
    suffix: "%",
  },
];

export default function ResultsSummary({ data = {} }) {
  return (
    <Grid container spacing={2}>
      {summaryItems.map((item) => {
        const Icon = item.icon;
        const value = data[item.key] ?? 0;

        return (
          <Grid item xs={12} sm={6} lg={3} key={item.key}>
            <Paper sx={{ p: 2.5, height: "100%", borderRadius: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: `${item.color}18`,
                    color: item.color,
                  }}
                >
                  <Icon />
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {`${value}${item.suffix || ""}`}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}