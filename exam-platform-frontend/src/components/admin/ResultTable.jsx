import {
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

export default function ResultTable({
  results = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onDownload,
}) {
  const count = totalCount ?? results.length;

  const visibleResults =
    totalCount === undefined
      ? results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : results;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 550 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Exam</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleResults.map((result, index) => {
              const id = result.id ?? result.resultId ?? index;
              const candidate =
                result.candidateName ||
                result.candidate?.name ||
                result.user?.name ||
                "Unknown candidate";

              const score = Number(result.score ?? 0);
              const maxScore = Number(result.maxScore ?? result.totalMarks ?? 100);
              const percentage =
                result.percentage ??
                (maxScore > 0 ? (score / maxScore) * 100 : 0);

              const passed =
                result.passed ??
                String(result.status || "").toLowerCase() === "passed";

              return (
                <TableRow hover key={id}>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography fontWeight={700}>{candidate}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {result.candidateId ?? result.userId ?? "—"}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    {result.examTitle || result.exam?.title || "Assessment"}
                  </TableCell>

                  <TableCell>
                    {score} / {maxScore}
                  </TableCell>

                  <TableCell>{Number(percentage).toFixed(1)}%</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        result.status ||
                        (passed ? "Passed" : "Completed")
                      }
                      color={passed ? "success" : "default"}
                    />
                  </TableCell>

                  <TableCell>
                    {result.completedAt
                      ? new Date(result.completedAt).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end">
                      {onView && (
                        <Tooltip title="View result">
                          <IconButton
                            aria-label="View result"
                            onClick={() => onView(result)}
                          >
                            <VisibilityRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      {onDownload && (
                        <Tooltip title="Download result">
                          <IconButton
                            aria-label="Download result"
                            onClick={() => onDownload(result)}
                          >
                            <DownloadRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}

            {!loading && visibleResults.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No examination results found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {loading && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography textAlign="center" sx={{ py: 4 }}>
                    Loading results...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={(_, nextPage) => onPageChange?.(nextPage)}
        onRowsPerPageChange={(event) => {
          onRowsPerPageChange?.(Number(event.target.value));
          onPageChange?.(0);
        }}
      />
    </Paper>
  );
}