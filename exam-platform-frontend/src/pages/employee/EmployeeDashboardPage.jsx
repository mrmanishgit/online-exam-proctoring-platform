import { useNavigate } from "react-router-dom";
import {
  AssignmentOutlined,
  CheckCircleRounded,
  GroupsOutlined,
  ScheduleOutlined,
  ArrowForward,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PageHeader from "../../components/common/PageHeader";

const stats = [
  {
    title: "Assigned Exams",
    value: "08",
    description: "Exams assigned to you",
    icon: AssignmentOutlined,
  },
  {
    title: "Pending Reviews",
    value: "12",
    description: "Attempts awaiting review",
    icon: ScheduleOutlined,
  },
  {
    title: "Reviewed",
    value: "34",
    description: "Attempts reviewed",
    icon: CheckCircleRounded,
  },
  {
    title: "Candidates",
    value: "156",
    description: "Across assigned exams",
    icon: GroupsOutlined,
  },
];

const assignments = [
  {
    id: "EX-301",
    title: "Java Programming Assessment",
    candidates: 42,
    date: "2026-11-02",
    status: "Scheduled",
  },
  {
    id: "EX-302",
    title: "Database Fundamentals",
    candidates: 36,
    date: "2026-11-04",
    status: "Scheduled",
  },
  {
    id: "EX-303",
    title: "Python Coding Test",
    candidates: 28,
    date: "2026-10-30",
    status: "Review Pending",
  },
];

export default function EmployeeDashboardPage() {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Employee Dashboard"
        subtitle="Manage assigned assessments and candidate submissions."
      />

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Grid key={stat.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={800} mt={1}>
                        {stat.value}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 1.2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Icon color="primary" />
                    </Box>
                  </Stack>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mt={2}
                  >
                    {stat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            mb={3}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Assigned Assessments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overview of your examination responsibilities.
              </Typography>
            </Box>

            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate("/employee/exams")}
            >
              View all assignments
            </Button>
          </Stack>

          <Stack spacing={2}>
            {assignments.map((exam) => (
              <Box
                key={exam.id}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700}>{exam.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {exam.id} · {exam.candidates} candidates ·{" "}
                      {exam.date}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    onClick={() => navigate("/employee/exams")}
                  >
                    View assignment
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}