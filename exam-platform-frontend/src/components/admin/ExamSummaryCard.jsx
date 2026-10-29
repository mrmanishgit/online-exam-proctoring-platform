import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import {
  Assignment,
  PeopleAlt,
  CheckCircleOutline,
  PendingActions,
} from "@mui/icons-material";

const iconMap = {
  exams: Assignment,
  candidates: PeopleAlt,
  completed: CheckCircleOutline,
  pending: PendingActions,
};

export default function ExamSummaryCard({
  title,
  value = 0,
  subtitle = "",
  type = "exams",
  color = "primary.main",
}) {
  const Icon = iconMap[type] || Assignment;

  return (
    <Card sx={{ height: "100%", borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ my: 1, overflowWrap: "anywhere" }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              bgcolor: color,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}