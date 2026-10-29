import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

const values = [
  {
    icon: <SecurityRoundedIcon />,
    title: "Security first",
    description:
      "Support secure examination workflows with authentication, access controls, and transparent proctoring policies.",
  },
  {
    icon: <CodeRoundedIcon />,
    title: "Practical assessments",
    description:
      "Bring multiple-choice assessments and programming challenges into one examination platform.",
  },
  {
    icon: <InsightsRoundedIcon />,
    title: "Meaningful insights",
    description:
      "Help authorized educators review submissions, assessment outcomes, and candidate performance.",
  },
];

export default function AboutPage() {
  return (
    <Box>
      <Box
        sx={{
          py: { xs: 7, md: 11 },
          background:
            "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 55%, #E0F2FE 100%)",
        }}
      >
        <Container maxWidth="lg">
          <PageHeader
            title="About ExamPilot"
            subtitle="A unified workspace for modern online examinations and skills assessments."
          />

          <Typography
            color="text.secondary"
            sx={{ maxWidth: 760, lineHeight: 1.9, fontSize: 17 }}
          >
            ExamPilot is designed to bring examination management, candidate
            workflows, coding assessments, and result review together in one
            accessible platform. Our goal is to make online assessments easier
            to organize and easier to understand.
          </Typography>

          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{ mt: 4 }}
          >
            Get started
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Typography variant="h4" fontWeight={800} textAlign="center" mb={1}>
          What guides us
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          mb={5}
        >
          The principles behind the ExamPilot experience.
        </Typography>

        <Grid container spacing={3}>
          {values.map((item) => (
            <Grid key={item.title} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: "100%",
                  p: 3.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    bgcolor: "#EEF2FF",
                    color: "#4F46E5",
                    display: "grid",
                    placeItems: "center",
                    mb: 2.5,
                    "& svg": { fontSize: 28 },
                  }}
                >
                  {item.icon}
                </Box>

                <Typography variant="h6" fontWeight={800} mb={1}>
                  {item.title}
                </Typography>

                <Typography color="text.secondary" lineHeight={1.8}>
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}