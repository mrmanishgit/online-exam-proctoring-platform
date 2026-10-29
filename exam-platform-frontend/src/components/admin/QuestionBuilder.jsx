import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const createOption = () => ({
  id: crypto.randomUUID(),
  text: "",
});

const createQuestion = () => ({
  id: crypto.randomUUID(),
  text: "",
  type: "SINGLE_CHOICE",
  marks: 1,
  options: [createOption(), createOption(), createOption(), createOption()],
  correctAnswers: [],
  explanation: "",
});

export default function QuestionBuilder({
  initialQuestions = [],
  onChange,
  onSave,
  saving = false,
}) {
  const [questions, setQuestions] = useState(() =>
    initialQuestions.length
      ? initialQuestions.map((question) => ({
          ...question,
          options: (question.options || []).map((option) =>
            typeof option === "string"
              ? { id: crypto.randomUUID(), text: option }
              : { ...option, id: option.id ?? crypto.randomUUID() }
          ),
          correctAnswers: question.correctAnswers || [],
        }))
      : [createQuestion()]
  );

  const [error, setError] = useState("");

  const updateQuestions = (nextQuestions) => {
    setQuestions(nextQuestions);
    onChange?.(nextQuestions);
  };

  const updateQuestion = (questionId, changes) => {
    updateQuestions(
      questions.map((question) =>
        question.id === questionId ? { ...question, ...changes } : question
      )
    );
  };

  const updateOption = (question, optionId, text) => {
    const options = question.options.map((option) =>
      option.id === optionId ? { ...option, text } : option
    );

    updateQuestion(question.id, { options });
  };

  const toggleCorrectAnswer = (question, optionId, checked) => {
    const multiple = question.type === "MULTIPLE_CHOICE";

    const correctAnswers = checked
      ? multiple
        ? [...new Set([...question.correctAnswers, optionId])]
        : [optionId]
      : question.correctAnswers.filter((id) => id !== optionId);

    updateQuestion(question.id, { correctAnswers });
  };

  const addOption = (question) => {
    updateQuestion(question.id, {
      options: [...question.options, createOption()],
    });
  };

  const removeOption = (question, optionId) => {
    if (question.options.length <= 2) return;

    updateQuestion(question.id, {
      options: question.options.filter((option) => option.id !== optionId),
      correctAnswers: question.correctAnswers.filter((id) => id !== optionId),
    });
  };

  const removeQuestion = (questionId) => {
    if (questions.length <= 1) return;
    updateQuestions(questions.filter((question) => question.id !== questionId));
  };

  const validateAndSave = () => {
    const invalidQuestion = questions.find(
      (question) =>
        !question.text.trim() ||
        question.options.some((option) => !option.text.trim()) ||
        question.correctAnswers.length === 0 ||
        Number(question.marks) <= 0
    );

    if (invalidQuestion) {
      setError(
        "Each question needs text, valid options, at least one correct answer, and positive marks."
      );
      return;
    }

    setError("");
    onSave?.(questions);
  };

  return (
    <Stack spacing={2.5}>
      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {questions.map((question, questionIndex) => (
        <Card key={question.id} variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" fontWeight={800}>
                Question {questionIndex + 1}
              </Typography>

              <IconButton
                color="error"
                aria-label={`Remove question ${questionIndex + 1}`}
                disabled={questions.length <= 1}
                onClick={() => removeQuestion(question.id)}
              >
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Stack>

            <Stack spacing={2}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Question text"
                value={question.text}
                onChange={(event) =>
                  updateQuestion(question.id, { text: event.target.value })
                }
                required
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    select
                    label="Question type"
                    value={question.type}
                    onChange={(event) => {
                      const type = event.target.value;
                      updateQuestion(question.id, {
                        type,
                        correctAnswers:
                          type === "MULTIPLE_CHOICE"
                            ? question.correctAnswers
                            : question.correctAnswers.slice(0, 1),
                      });
                    }}
                  >
                    <MenuItem value="SINGLE_CHOICE">Single choice</MenuItem>
                    <MenuItem value="MULTIPLE_CHOICE">Multiple choice</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Marks"
                    inputProps={{ min: 1 }}
                    value={question.marks}
                    onChange={(event) =>
                      updateQuestion(question.id, {
                        marks: Number(event.target.value),
                      })
                    }
                  />
                </Grid>
              </Grid>

              <Typography fontWeight={700}>Answer options</Typography>

              {question.options.map((option, optionIndex) => (
                <Stack
                  key={option.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <FormControlLabel
                    sx={{ mr: 0 }}
                    control={
                      <Checkbox
                        checked={question.correctAnswers.includes(option.id)}
                        onChange={(event) =>
                          toggleCorrectAnswer(
                            question,
                            option.id,
                            event.target.checked
                          )
                        }
                      />
                    }
                    label=""
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label={`Option ${optionIndex + 1}`}
                    value={option.text}
                    onChange={(event) =>
                      updateOption(question, option.id, event.target.value)
                    }
                  />

                  <IconButton
                    color="error"
                    aria-label={`Remove option ${optionIndex + 1}`}
                    disabled={question.options.length <= 2}
                    onClick={() => removeOption(question, option.id)}
                  >
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                </Stack>
              ))}

              <Typography variant="caption" color="text.secondary">
                Select the checkbox beside each correct answer.
              </Typography>

              <Box>
                <Button
                  startIcon={<AddRoundedIcon />}
                  onClick={() => addOption(question)}
                >
                  Add option
                </Button>
              </Box>

              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Explanation (optional)"
                value={question.explanation}
                onChange={(event) =>
                  updateQuestion(question.id, {
                    explanation: event.target.value,
                  })
                }
              />
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={() =>
            updateQuestions([...questions, createQuestion()])
          }
        >
          Add question
        </Button>

        <Button
          variant="contained"
          onClick={validateAndSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save questions"}
        </Button>
      </Stack>
    </Stack>
  );
}