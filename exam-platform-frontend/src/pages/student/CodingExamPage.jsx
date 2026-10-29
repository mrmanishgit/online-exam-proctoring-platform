import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { PlayArrow, Send, SaveOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";

const starterCode = {
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Write your solution here

        scanner.close();
    }
}`,
  python: `def solve():
    # Write your solution here
    pass

if __name__ == "__main__":
    solve()
`,
  javascript: `function solve(input) {
  // Write your solution here
}

const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();
console.log(solve(input));
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Write your solution here

    return 0;
}`,
};

export default function CodingExamPage() {
  const navigate = useNavigate();
  const { examId } = useParams();

  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(starterCode.java);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setCode(starterCode[nextLanguage]);
    setOutput("");
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput(
      "Execution service is not connected yet.\nConnect this action to your backend code execution API.",
    );
    setIsRunning(false);
  };

  const submitCode = async () => {
    setSubmitted(true);
    navigate(`/student/exams/${examId}/submission`, {
      state: {
        type: "coding",
        language,
        code,
        customInput,
        submittedAt: new Date().toISOString(),
        status: "pending",
        message:
          "Demo submission only. Connect the coding submission API to save and evaluate this solution.",
      },
    });
  };

  return (
    <Box>
      <PageHeader
        title="Coding Assessment"
        subtitle="Solve the problem, test your approach, and submit your solution."
        action={
          <Chip
            icon={<SaveOutlined />}
            label="Draft in current session"
            variant="outlined"
          />
        }
      />

      <Alert severity="warning" sx={{ mb: 2 }}>
        Code execution is not connected. Do not run untrusted code directly on
        the frontend; use a secured server-side execution sandbox.
      </Alert>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(280px, 0.8fr) minmax(0, 1.5fr)" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="overline" color="primary" fontWeight={700}>
              Problem 01
            </Typography>

            <Typography variant="h5" fontWeight={700} mb={2}>
              Two Sum
            </Typography>

            <Stack direction="row" spacing={1} mb={2}>
              <Chip label="Easy" color="success" size="small" />
              <Chip label="Array" size="small" />
              <Chip label="Hash Map" size="small" />
            </Stack>

            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              Given an array of integers and a target value, return the indices
              of two distinct elements whose sum equals the target. Assume
              exactly one valid solution exists.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={700} mb={1}>
              Example
            </Typography>

            <Box
              component="pre"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                whiteSpace: "pre-wrap",
                fontSize: 13,
              }}
            >
              {`Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]

Explanation: nums[0] + nums[1] = 9`}
            </Box>

            <Typography fontWeight={700} mt={2} mb={1}>
              Constraints
            </Typography>

            <Typography variant="body2" color="text.secondary">
              • 2 ≤ nums.length ≤ 10⁴
              {"\n"}• -10⁹ ≤ nums[i] ≤ 10⁹
              {"\n"}• Exactly one solution exists.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              mb={2}
            >
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="coding-language-label">Language</InputLabel>
                <Select
                  labelId="coding-language-label"
                  value={language}
                  label="Language"
                  onChange={(event) => changeLanguage(event.target.value)}
                >
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                </Select>
              </FormControl>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<PlayArrow />}
                  onClick={runCode}
                  disabled={isRunning || submitted}
                >
                  {isRunning ? "Running..." : "Run"}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={submitCode}
                  disabled={submitted}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>

            <Box
              component="textarea"
              aria-label="Code editor"
              spellCheck={false}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              sx={{
                display: "block",
                width: "100%",
                minHeight: 420,
                resize: "vertical",
                p: 2,
                boxSizing: "border-box",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "#111827",
                color: "#e5e7eb",
                fontFamily: '"Fira Code", Consolas, monospace',
                fontSize: 14,
                lineHeight: 1.7,
                outline: "none",
                tabSize: 4,
                "&:focus": { borderColor: "primary.main" },
              }}
            />

            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              {language.toUpperCase()} · Starter code
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={700} mb={1}>
              Custom input
            </Typography>

            <Box
              component="textarea"
              aria-label="Custom input"
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              placeholder="Enter test input here..."
              sx={{
                width: "100%",
                minHeight: 90,
                resize: "vertical",
                p: 1.5,
                boxSizing: "border-box",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                color: "text.primary",
                fontFamily: "monospace",
                fontSize: 13,
              }}
            />

            <Typography fontWeight={700} mt={2} mb={1}>
              Execution output
            </Typography>

            <Box
              component="pre"
              sx={{
                minHeight: 70,
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              {output || "Output will appear here after running your code."}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}