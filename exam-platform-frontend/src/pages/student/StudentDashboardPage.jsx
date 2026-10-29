import { Box, Button, Grid, Stack, Typography, Paper } from "@mui/material";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import useAuth from "../../hooks/useAuth";

const stats = [
  { label: "Available exams", value: "08", icon: AssignmentRoundedIcon, color: "#4F46E5", bg: "#EEF2FF" },
  { label: "Completed attempts", value: "12", icon: TaskAltRoundedIcon, color: "#059669", bg: "#D1FAE5" },
  { label: "Average score", value: "84%", icon: EmojiEventsRoundedIcon, color: "#D97706", bg: "#FEF3C7" },
  { label: "Upcoming exams", value: "03", icon: ScheduleRoundedIcon, color: "#0284C7", bg: "#E0F2FE" },
];

const upcomingExams = [
  { id: "EX-101", title: "Java Programming Assessment", category: "Programming", date: "Tomorrow, 10:00 AM", duration: "60 minutes" },
  { id: "EX-102", title: "Database Fundamentals", category: "Technical", date: "Oct 31, 2026 · 2:00 PM", duration: "45 minutes" },
  { id: "EX-103", title: "Logical Reasoning Test", category: "Aptitude", date: "Nov 02, 2026 · 11:00 AM", duration: "30 minutes" },
];

export default function StudentDashboardPage() {
  const { user } = useAuth();

  return (
    <Stack spacing={4}>
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}!`}
        subtitle="Here is your examination overview and what is coming up next."
      />

      <Grid container spacing={2.5}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={850} mt={1}>
                      {stat.value}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: stat.bg, color: stat.color, display: "grid", placeItems: "center" }}>
                    <Icon />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          color: "white",
          background: "linear-gradient(120deg, #3730A3, #4F46E5 55%, #0284C7)",
          overflow: "hidden",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="overline" sx={{ opacity: 0.8 }}>
              YOUR NEXT STEP
            </Typography>
            <Typography variant="h4" fontWeight={850} mt={1}>
              Ready for your next challenge?
            </Typography>
            <Typography sx={{ opacity: 0.85, mt: 1, maxWidth: 600 }}>
              Explore scheduled assessments, review instructions, and prepare your system before exam time.
            </Typography>
            <Button
              component={Link}
              to="/student/exams"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ mt: 3, bgcolor: "white", color: "#3730A3", "&:hover": { bgcolor: "#EEF2FF" } }}
            >
              Explore exams
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "center" } }}>
              <AssignmentRoundedIcon sx={{ fontSize: { xs: 80, md: 130 }, opacity: 0.3 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Upcoming exams</Typography>
            <Typography color="text.secondary" mt={0.5}>Plan ahead and prepare for your assessments.</Typography>
          </Box>
          <Button component={Link} to="/student/exams" endIcon={<ArrowForwardRoundedIcon />}>
            View all
          </Button>
        </Stack>

        <Stack spacing={2}>
          {upcomingExams.map((exam) => (
            <Paper key={exam.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: "#EEF2FF", color: "#4F46E5", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <AssignmentRoundedIcon />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={750}>{exam.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {exam.category} · {exam.duration} · {exam.date}
                  </Typography>
                </Box>

                <Button component={Link} to={`/student/exams/${exam.id}`} variant="outlined">
                  View details
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}