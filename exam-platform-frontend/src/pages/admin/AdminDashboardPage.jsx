import { useNavigate } from "react-router-dom";
import {
  AssignmentOutlined,
  GroupsOutlined,
  QuizOutlined,
  TrendingUpOutlined,
  ArrowForward,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";

const stats = [
  {
    title: "Total Candidates",
    value: "1,284",
    change: "+12% this month",
    icon: GroupsOutlined,
  },
  {
    title: "Active Exams",
    value: "24",
    change: "8 scheduled soon",
    icon: QuizOutlined,
  },
  {
    title: "Total Attempts",
    value: "3,642",
    change: "+18% this month",
    icon: AssignmentOutlined,
  },
  {
    title: "Completion Rate",
    value: "87.5%",
    change: "Demo metric",
    icon: TrendingUpOutlined,
  },
];

const recentExams = [
  {
    id: "EX-101",
    name: "Java Fundamentals",
    candidates: 120,
    status: "Published",
  },
  {
    id: "EX-102",
    name: "Python Coding Assessment",
    candidates: 85,
    status: "Scheduled",
  },
  {
    id: "EX-103",
    name: "Database Management",
    candidates: 64,
    status: "Draft",
  },
];

const quickActions = [
  {
    label: "Create Exam",
    description: "Build a new assessment",
    path: "/admin/exams/create",
  },
  {
    label: "Manage Candidates",
    description: "View candidate accounts",
    path: "/admin/users",
  },
  {
    label: "Live Monitoring",
    description: "Review active exam sessions",
    path: "/admin/monitoring",
  },
  {
    label: "View Reports",
    description: "Analyze assessment results",
    path: "/admin/reports",
  },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor platform activity and manage online examinations."
      />

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Grid key={stat.title} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Card sx={{ height: "100%", borderRadius: 3 }}>
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
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                mb={3}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Recent Examinations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest assessments on the platform
                  </Typography>
                </Box>

                <Button
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/admin/exams")}
                >
                  View all
                </Button>
              </Stack>

              <Stack spacing={2}>
                {recentExams.map((exam) => (
                  <Box
                    key={exam.id}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700}>
                          {exam.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {exam.id} · {exam.candidates} candidates
                        </Typography>
                      </Box>

                      <Chip
                        size="small"
                        label={exam.status}
                        color={
                          exam.status === "Published"
                            ? "success"
                            : exam.status === "Scheduled"
                              ? "info"
                              : "default"
                        }
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Quick Actions
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Common administration tasks
              </Typography>

              <Stack spacing={1.5}>
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outlined"
                    onClick={() => navigate(action.path)}
                    sx={{
                      justifyContent: "space-between",
                      textAlign: "left",
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Box>
                      <Typography fontWeight={700}>
                        {action.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: "none" }}
                      >
                        {action.description}
                      </Typography>
                    </Box>

                    <ArrowForward fontSize="small" />
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mt={3}
      >
        Dashboard metrics and examination records are demo data. Replace them
        with backend API responses before deployment.
      </Typography>
    </Box>
  );
}