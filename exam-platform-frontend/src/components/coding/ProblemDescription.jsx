import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const DIFFICULTY_COLORS = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

export default function ProblemDescription({ problem }) {
  if (!problem) {
    return (
      <Typography color="text.secondary">
        Select a coding problem to view its description.
      </Typography>
    );
  }

  const difficulty = String(problem.difficulty || "medium").toLowerCase();
  const examples = problem.examples || [];
  const constraints = problem.constraints || [];

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        spacing={1}
        sx={{ mb: 1.5 }}
      >
        <Typography variant="h5" fontWeight={800}>
          {problem.title || problem.name || "Coding problem"}
        </Typography>

        <Chip
          size="small"
          label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          color={DIFFICULTY_COLORS[difficulty] || "default"}
        />

        {problem.marks !== undefined && (
          <Chip size="small" variant="outlined" label={`${problem.marks} marks`} />
        )}
      </Stack>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
      >
        {problem.description || "No problem description has been provided."}
      </Typography>

      {examples.map((example, index) => (
        <Box key={index} sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
            Example {index + 1}
          </Typography>

          <Paper
            variant="outlined"
            sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}
          >
            <Typography variant="body2" fontWeight={700}>
              Input
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                mb: 1.5,
                mt: 0.5,
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {String(example.input ?? "")}
            </Box>

            <Typography variant="body2" fontWeight={700}>
              Output
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                mt: 0.5,
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {String(example.output ?? "")}
            </Box>

            {example.explanation && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2">
                  <strong>Explanation:</strong> {example.explanation}
                </Typography>
              </>
            )}
          </Paper>
        </Box>
      ))}

      {constraints.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
            Constraints
          </Typography>
          <Stack spacing={0.75}>
            {constraints.map((constraint, index) => (
              <Typography
                key={index}
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "monospace" }}
              >
                • {constraint}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );
}