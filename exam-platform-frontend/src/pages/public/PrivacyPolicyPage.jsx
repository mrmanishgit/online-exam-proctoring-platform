import {
  Box,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";

const sections = [
  {
    title: "1. Information we collect",
    text: "Depending on the features enabled by the organization operating ExamPilot, information may include account details, examination responses, assessment results, and technical information needed to operate the service.",
  },
  {
    title: "2. Examination and proctoring data",
    text: "Where proctoring features are enabled, the platform may request camera, microphone, screen-sharing, or browser permissions. Any collection or recording must be disclosed to candidates before the examination and handled according to applicable law and the organization's policies.",
  },
  {
    title: "3. How information is used",
    text: "Information may be used to authenticate users, deliver examinations, save answers, evaluate submissions, investigate examination integrity concerns, and maintain platform security.",
  },
  {
    title: "4. Data sharing and access",
    text: "Access to candidate information should be limited to authorized personnel with a legitimate need. Information should not be shared beyond the purposes disclosed to users unless legally required or otherwise permitted.",
  },
  {
    title: "5. Security and retention",
    text: "Reasonable safeguards should be used to protect information. Retention periods should be established by the organization operating the service and applicable legal requirements. No online system can guarantee absolute security.",
  },
  {
    title: "6. Your choices and rights",
    text: "Depending on applicable law, you may have rights to access, correct, delete, or obtain information about the processing of your personal data. Contact the organization responsible for your account to make a request.",
  },
  {
    title: "7. Contact and policy updates",
    text: "The organization operating ExamPilot should provide an appropriate privacy contact and update this policy when its practices change.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <PageHeader
        title="Privacy policy"
        subtitle="How personal information may be handled when using ExamPilot."
      />

      <Box
        sx={{
          bgcolor: "info.50",
          border: "1px solid",
          borderColor: "info.light",
          p: 2.5,
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Typography color="text.secondary" variant="body2" lineHeight={1.8}>
          Template policy: this page describes intended practices and must be
          reviewed and customized by the organization operating the platform
          before production use. It is not legal advice.
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