import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  CloudUploadOutlined,
  DownloadOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import { downloadTextFile } from "../../utils/downloadUtils";

export default function QuestionImportPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setNotice("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedExtensions = [".csv", ".json"];
    const fileName = selectedFile.name.toLowerCase();
    const validExtension = allowedExtensions.some((extension) =>
      fileName.endsWith(extension),
    );

    if (!validExtension) {
      setError("Choose a CSV or JSON file.");
      setFile(null);
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("The file must be smaller than 5 MB.");
      setFile(null);
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const downloadTemplate = () => {
    const csv = [
      "question,type,optionA,optionB,optionC,optionD,correctAnswer,marks,category",
      '"Which keyword inherits a Java class?",MCQ,extends,implements,import,package,extends,2,Java',
      '"What is 2 + 2?",MCQ,3,4,5,6,4,1,Mathematics',
    ].join("\n");

    downloadTextFile(csv, "question-import-template.csv", "text/csv;charset=utf-8");
  };

  const handleImport = async () => {
    if (!file) {
      setError("Select a CSV or JSON file before importing.");
      return;
    }

    setError("");
    setNotice(
      `Selected ${file.name}. Connect the question import API to validate and save its contents.`,
    );
  };

  return (
    <Box>
      <PageHeader
        title="Import Questions"
        subtitle="Upload a question bank file for bulk question creation."
        action={
          <Button
            startIcon={<ArrowBack />}
            variant="outlined"
            onClick={() => navigate("/admin/questions")}
          >
            Back to Questions
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {notice && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}

      <Card sx={{ maxWidth: 800, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Upload question file
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Accepted formats: CSV and JSON. Maximum file size: 5 MB.
          </Typography>

          <Box
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 3,
              p: { xs: 3, md: 5 },
              textAlign: "center",
            }}
          >
            <CloudUploadOutlined
              sx={{ fontSize: 54, color: "primary.main", mb: 1 }}
            />

            <Typography fontWeight={700} mb={1}>
              Select your question file
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Choose a prepared CSV or JSON file from your computer.
            </Typography>

            <Button variant="outlined" component="label">
              Choose File
              <input
                type="file"
                hidden
                accept=".csv,.json,application/json,text/csv"
                onChange={handleFileChange}
              />
            </Button>

            {file && (
              <Typography variant="body2" sx={{ mt: 2, overflowWrap: "anywhere" }}>
                Selected: {file.name} (
                {(file.size / 1024).toFixed(1)} KB)
              </Typography>
            )}
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              startIcon={<CloudUploadOutlined />}
              onClick={handleImport}
              disabled={!file}
            >
              Import Questions
            </Button>

            <Button
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={downloadTemplate}
            >
              Download CSV Template
            </Button>
          </Stack>

          <Alert severity="warning" sx={{ mt: 3 }}>
            File selection and validation run in the browser only. The import
            API must validate file contents, question types, answer keys, and
            permissions on the server.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}