import { Alert, Box, Button, Stack } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

export default function ExamTakingUnavailablePage() {
  const { examId } = useParams();
  return <Box><PageHeader title="Exam attempt" subtitle={`Assessment #${examId}`} />
    <Stack spacing={2}>
      <Alert severity="warning">This route is now handled instead of showing a 404, but the real attempt workflow is not yet connected. The current source does not provide a verified start-attempt, secure question-delivery, autosave, submit and grading workflow. No demo questions or fabricated scores are shown here.</Alert>
      <Button component={Link} to={`/student/exams/${examId}`} variant="contained">Back to exam details</Button>
    </Stack>
  </Box>;
}
