import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  EmailOutlined,
  PhoneOutlined,
  AssignmentOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";

const demoCandidate = {
  id: "USR-1001",
  name: "Aarav Sharma",
  email: "aarav@example.com",
  phone: "+91 90000 00000",
  department: "Computer Science",
  institution: "Demo Engineering College",
  status: "Active",
  examsAssigned: 5,
  examsCompleted: 3,
  averageScore: 82,
};

export default function CandidateDetailsPage() {
  const navigate = useNavigate();
  const { candidateId } = useParams();

  const candidate = {
    ...demoCandidate,
    id: candidateId || demoCandidate.id,
  };

  return (
    <Box>
      <PageHeader
        title="Candidate Details"
        subtitle="View candidate information and examination activity."
        action={
          <Button
            startIcon={<ArrowBack />}
            variant="outlined"
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </Button>
        }
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        The information displayed here is sample data. Load the candidate
        details from your backend using the candidate ID.
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: 36,
                }}
              >
                {candidate.name.charAt(0)}
              </Avatar>

              <Typography variant="h5" fontWeight={800}>
                {candidate.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {candidate.id}
              </Typography>

              <Chip label={candidate.status} color="success" sx={{ mt: 2 }} />

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2} textAlign="left">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <EmailOutlined color="action" />
                  <Typography variant="body2">{candidate.email}</Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PhoneOutlined color="action" />
                  <Typography variant="body2">{candidate.phone}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            {[
              {
                label: "Exams Assigned",
                value: candidate.examsAssigned,
              },
              {
                label: "Exams Completed",
                value: candidate.examsCompleted,
              },
              {
                label: "Average Demo Score",
                value: `${candidate.averageScore}%`,
              },
            ].map((item) => (
              <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={800} mt={1}>
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Academic Information
                  </Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Institution
                      </Typography>
                      <Typography fontWeight={600}>
                        {candidate.institution}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Department
                      </Typography>
                      <Typography fontWeight={600}>
                        {candidate.department}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Button
                    variant="contained"
                    startIcon={<AssignmentOutlined />}
                    onClick={() => navigate("/admin/results")}
                  >
                    View Results
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}