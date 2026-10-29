import {
  Box,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";

const sections = [
  {
    title: "1. Acceptable use",
    text: "Users must provide accurate account information, protect their credentials, and use the platform only for authorized purposes. Attempts to disrupt the service, access other accounts, or bypass security controls are prohibited.",
  },
  {
    title: "2. Examination rules",
    text: "Candidates must follow the examination instructions provided by their institution or examiner. Prohibited materials, unauthorized collaboration, or other forms of misconduct may be handled according to the applicable examination policy.",
  },
  {
    title: "3. Account responsibilities",
    text: "Users are responsible for activities performed through their accounts and should report suspected unauthorized access promptly. Administrators are responsible for assigning appropriate access permissions.",
  },
  {
    title: "4. Assessment results",
    text: "Results, scores, and feedback are subject to the assessment rules and evaluation methods configured by the responsible institution. Users should contact the relevant examiner or administrator about disputes or corrections.",
  },
  {
    title: "5. Proctoring and monitoring",
    text: "If monitoring is enabled, users must be informed of the relevant permissions, data collection, and examination rules before participating. Proctoring alerts may require human review and should not automatically be treated as conclusive proof of misconduct.",
  },
  {
    title: "6. Availability and changes",
    text: "The service may be updated, interrupted, or modified for maintenance, security, or operational reasons. The platform operator should communicate material changes when appropriate.",
  },
  {
    title: "7. Suspension and termination",
    text: "Access may be restricted when necessary to protect the service, enforce applicable policies, or comply with legal obligations, subject to applicable law and relevant institutional procedures.",
  },
  {
    title: "8. Contact",
    text: "For questions about these terms, contact the organization or administrator responsible for providing your ExamPilot account.",
  },
];

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <PageHeader
        title="Terms of service"
        subtitle="Rules for using the ExamPilot online examination platform."
      />

      <Box
        sx={{
          bgcolor: "warning.50",
          border: "1px solid",
          borderColor: "warning.light",
          p: 2.5,
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Typography color="text.secondary" variant="body2" lineHeight={1.8}>
          Template terms: these provisions must be reviewed and customized by
          the platform operator before publication. They are not legal advice.
        </Typography>
      </Box>

      <Typography color="text.secondary" mb={4}>
        Last updated: October 29, 2026
      </Typography>

      {sections.map((section, index) => (
        <Box key={section.title} mb={3}>
          <Typography variant="h6" fontWeight={800} mb={1}>
            {section.title}
          </Typography>

          <Typography color="text.secondary" lineHeight={1.9}>
            {section.text}
          </Typography>

          {index !== sections.length - 1 && <Divider sx={{ mt: 3 }} />}
        </Box>
      ))}
    </Container>
  );
}