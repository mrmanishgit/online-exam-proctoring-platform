import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  CloudUploadOutlined,
  Delete,
  EditOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";

const initialQuestions = [
  {
    id: "Q-1001",
    text: "Which keyword is used to inherit a class in Java?",
    type: "Multiple Choice",
    category: "Java",
    marks: 2,
  },
  {
    id: "Q-1002",
    text: "Which SQL clause filters grouped records?",
    type: "Multiple Choice",
    category: "SQL",
    marks: 2,
  },
  {
    id: "Q-1003",
    text: "Explain the purpose of a REST API.",
    type: "Descriptive",
    category: "Backend",
    marks: 5,
  },
  {
    id: "Q-1004",
    text: "What is the time complexity of binary search?",
    type: "Multiple Choice",
    category: "Algorithms",
    marks: 2,
  },
];

export default function QuestionManagementPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) =>
        `${question.id} ${question.text} ${question.category}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [questions, search],
  );

  const addQuestion = () => {
    setNotice(
      "Connect the question creation form and question API to add a question.",
    );
  };

  const deleteQuestion = (id) => {
    const confirmed = window.confirm(
      "Remove this question from the current demo list?",
    );

    if (!confirmed) return;

    setQuestions((previous) =>
      previous.filter((question) => question.id !== id),
    );
    setNotice("Question removed from the local demo list only.");
  };

  return (
    <Box>
      <PageHeader
        title="Question Management"
        subtitle="Manage the question bank used by your examinations."
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<CloudUploadOutlined />}
              onClick={() => {
                window.location.href = "/admin/questions/import";
              }}
            >
              Import
            </Button>

            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={addQuestion}
            >
              Add Question
            </Button>
          </Stack>
        }
      />

      {notice && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search questions by text, category, or ID..."
          />
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {filteredQuestions.map((question) => (
          <Card key={question.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {question.id}
                  </Typography>

                  <Typography fontWeight={700} sx={{ my: 0.5 }}>
                    {question.text}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip size="small" label={question.category} />
                    <Chip size="small" label={question.type} variant="outlined" />
                    <Chip
                      size="small"
                      label={`${question.marks} marks`}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    startIcon={<EditOutlined />}
                    variant="outlined"
                    onClick={() =>
                      window.alert(
                        "Connect this action to the question editing form.",
                      )
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => deleteQuestion(question.id)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {filteredQuestions.length === 0 && (
          <EmptyState
            title="No questions found"
            description="Try another search term or add questions to the question bank."
          />
        )}
      </Stack>
    </Box>
  );
}