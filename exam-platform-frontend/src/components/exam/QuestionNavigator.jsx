import { Button, Stack } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function QuestionNavigator({
  currentIndex = 0,
  totalQuestions = 0,
  onPrevious,
  onNext,
  onSubmit,
  disabled = false,
  showSubmit = false,
}) {
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < totalQuestions - 1;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      justifyContent="space-between"
      alignItems={{ sm: "center" }}
      sx={{ width: "100%" }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBackRoundedIcon />}
        disabled={disabled || !hasPrevious}
        onClick={onPrevious}
      >
        Previous
      </Button>

      <Stack direction="row" spacing={1.5}>
        {showSubmit ? (
          <Button
            variant="contained"
            color="success"
            disabled={disabled}
            onClick={onSubmit}
          >
            Submit exam
          </Button>
        ) : (
          <Button
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            disabled={disabled || !hasNext}
            onClick={onNext}
          >
            Next question
          </Button>
        )}
      </Stack>
    </Stack>
  );
}