import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { ROUTES } from "../../app/routeConfig";

const features = [
  { icon: <SecurityRoundedIcon fontSize="large" />, title: "Secure assessments", text: "Role-based access and a focused exam experience." },
  { icon: <VideocamRoundedIcon fontSize="large" />, title: "Proctoring readiness", text: "Camera, microphone, screen-share, and exam integrity checks." },
  { icon: <CodeRoundedIcon fontSize="large" />, title: "Coding exams", text: "A dedicated coding workspace for programming assessments." },
  { icon: <AssessmentRoundedIcon fontSize="large" />, title: "Clear results", text: "Review attempts, scores, and performance breakdowns." },
];

export default function HomePage() {
  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{
        background: "linear-gradient(125deg, #111827 0%, #312E81 55%, #4F46E5 100%)",
        color: "common.white", py: { xs: 7, md: 11 }, overflow: "hidden",
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip label="Online Exam & Proctoring Platform" sx={{ mb: 2, bgcolor: "rgba(255,255,255,.12)", color: "white" }} />
              <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4.1rem" }, lineHeight: 1.08, maxWidth: 760 }}>
                Assess skills with confidence.
              </Typography>
              <Typography sx={{ mt: 2.5, maxWidth: 620, color: "rgba(255,255,255,.78)", fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.8 }}>
                A single workspace for online exams, coding assessments, candidate monitoring, and performance insights.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4 }}>
                <Button component={RouterLink} to={ROUTES.LOGIN} size="large" variant="contained" color="secondary" endIcon={<ArrowForwardRoundedIcon />}>
                  Sign in
                </Button>
                <Button component={RouterLink} to={ROUTES.ABOUT} size="large" variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,.5)" }}>
                  Explore platform
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, bgcolor: "rgba(255,255,255,.09)", color: "white", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(10px)" }}>
                <Typography variant="overline" sx={{ color: "#C7D2FE" }}>EXAMPILOT WORKSPACE</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1, mb: 2 }}>Everything in one place</Typography>
                {[
                  ["Exam delivery", "Questions, timer, autosave and submission"],
                  ["Integrity checks", "Permissions and proctoring event review"],
                  ["Performance", "Attempts, scores and reports"],
                ].map(([title, text]) => (
                  <Stack key={title} direction="row" spacing={2} alignItems="flex-start" sx={{ py: 1.5, borderTop: "1px solid rgba(255,255,255,.15)" }}>
                    <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#A5B4FC", mt: 1 }} />
                    <Box>
                      <Typography fontWeight={700}>{title}</Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,.7)" }}>{text}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 5, md: 8 } }}>
        <Box sx={{ maxWidth: 700, mb: 4 }}>
          <Typography color="primary.main" fontWeight={800} variant="overline">BUILT FOR ONLINE ASSESSMENTS</Typography>
          <Typography variant="h3" sx={{ mt: 1, mb: 1.5, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>A practical assessment workflow</Typography>
          <Typography color="text.secondary" lineHeight={1.8}>Give candidates a clear exam experience while helping administrators manage assessments and review outcomes.</Typography>
        </Box>
        <Grid container spacing={2.5}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper variant="outlined" sx={{ height: "100%", p: 2.5, borderRadius: 3 }}>
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1 }}>{feature.title}</Typography>
                <Typography color="text.secondary" variant="body2" lineHeight={1.7}>{feature.text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
