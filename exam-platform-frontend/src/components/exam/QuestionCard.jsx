import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import ReviewMarker from "./ReviewMarker";
import AnswerOptions from "./AnswerOptions";

export default function QuestionCard({
  question,
  questionNumber = 1,
  totalQuestions = 1,
  selectedAnswer,
  onAnswerChange,
  markedForReview = false,
  onReviewChange,
  disabled = false,
}) {
  if (!question) return null;

  const questionText = question.text || question.questionText || question.title || "";
  const options = question.options || question.answers || [];

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
          flexWrap="wrap"
        >
          <Box>
            <Typography variant="overline" color="primary" fontWeight={800}>
              QUESTION {questionNumber} OF {totalQuestions}
            </Typography>

            <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
              {questionText}
            </Typography>
          </Box>

          <ReviewMarker
            marked={markedForReview}
            onChange={onReviewChange}
            disabled={disabled}
            compact
          />
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 2, mb: 2 }}>
          {question.type && (
            <Chip size="small" label={String(question.type).replaceAll("_", " ")} />
          )}

          {question.marks !== undefined && (
            <Chip size="small" variant="outlined" label={`${question.marks} marks`} />
          )}
        </Box>

        {question.imageUrl && (
          <Box
            component="img"
            src={question.imageUrl}
            alt="Question illustration"
            sx={{
              display: "block",
              maxWidth: "100%",
              maxHeight: 320,
              objectFit: "contain",
              borderRadius: 2,
              mb: 2,
            }}
          />
        )}

        <Divider sx={{ mb: 2.5 }} />

        <AnswerOptions
          options={options}
          value={selectedAnswer}
          onChange={onAnswerChange}
          disabled={disabled}
          questionType={question.type}
        />
      </CardContent>
    </Card>
  );
}