import { useState } from "react";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

export default function TestCasePanel({
  testCases = [],
  activeCase,
  onCaseChange,
  results = [],
}) {
  const [internalIndex, setInternalIndex] = useState(0);

  const selectedIndex =
    activeCase === undefined ? internalIndex : activeCase;

  const selectedCase = testCases[selectedIndex];
  const selectedResult = results[selectedIndex];

  const selectCase = (index) => {
    setInternalIndex(index);
    onCaseChange?.(index);
  };

  if (!testCases.length) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography color="text.secondary">
          No sample test cases are available.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ px: 2, pt: 1 }}>
        <Typography variant="subtitle1" fontWeight={800} sx={{ py: 1 }}>
          Test cases
        </Typography>

        <Tabs
          value={Math.min(selectedIndex, testCases.length - 1)}
          onChange={(_, index) => selectCase(index)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {testCases.map((testCase, index) => (
            <Tab
              key={testCase.id ?? index}
              label={`Case ${index + 1}`}
              id={`test-case-tab-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      <Divider />

      {selectedCase && (
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography fontWeight={700}>
              {selectedCase.name || `Test case ${selectedIndex + 1}`}
            </Typography>

            {selectedResult?.status && (
              <Chip
                size="small"
                label={selectedResult.status}
                color={
                  String(selectedResult.status).toLowerCase() === "passed"
                    ? "success"
                    : String(selectedResult.status).toLowerCase() === "failed"
                      ? "error"
                      : "default"
                }
              />
            )}
          </Stack>

          <Typography variant="body2" fontWeight={700}>
            Input
          </Typography>
          <Box
            component="pre"
            sx={{
              mt: 0.5,
              mb: 2,
              p: 1.5,
              bgcolor: "action.hover",
              borderRadius: 1.5,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              fontFamily: "monospace",
            }}
          >
            {String(selectedCase.input ?? "")}
          </Box>

          {selectedResult && (
            <>
              <Typography variant="body2" fontWeight={700}>
                Actual output
              </Typography>
              <Box
                component="pre"
                sx={{
                  mt: 0.5,
                  mb: 2,
                  p: 1.5,
                  bgcolor: "action.hover",
                  borderRadius: 1.5,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  fontFamily: "monospace",
                }}
              >
                {String(selectedResult.output ?? selectedResult.actualOutput ?? "")}
              </Box>
            </>
          )}

          {selectedCase.expectedOutput !== undefined && (
            <>
              <Typography variant="body2" fontWeight={700}>
                Expected output
              </Typography>
              <Box
                component="pre"
                sx={{
                  mt: 0.5,
                  mb: 0,
                  p: 1.5,
                  bgcolor: "action.hover",
                  borderRadius: 1.5,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  fontFamily: "monospace",
                }}
              >
                {String(selectedCase.expectedOutput)}
              </Box>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
}