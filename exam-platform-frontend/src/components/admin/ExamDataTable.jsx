import {
  Box,
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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EmptyState from "../common/EmptyState";

function getStatusColor(status) {
  const normalized = String(status || "").toLowerCase();

  if (["active", "published", "completed"].includes(normalized)) return "success";
  if (["scheduled", "draft"].includes(normalized)) return "warning";
  if (["cancelled", "failed"].includes(normalized)) return "error";

  return "default";
}

export default function ExamDataTable({
  exams = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  page = 0,
  rowsPerPage = 10,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}) {
  const count = totalCount ?? exams.length;
  const paginatedExams =
    totalCount === undefined
      ? exams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : exams;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Exam</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Scheduled</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedExams.map((exam, index) => {
              const id = exam.id ?? exam.examId ?? index;
              const status = exam.status || "Draft";

              return (
                <TableRow hover key={id}>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography fontWeight={700}>
                        {exam.title || exam.name || "Untitled exam"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exam.description || `Exam ID: ${id}`}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    {exam.questionCount ??
                      exam.totalQuestions ??
                      exam.questions?.length ??
                      0}
                  </TableCell>

                  <TableCell>
                    {exam.durationMinutes ?? exam.duration ?? 60} min
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={status}
                      color={getStatusColor(status)}
                    />
                  </TableCell>

                  <TableCell>
                    {exam.scheduledAt || exam.startTime
                      ? new Date(
                          exam.scheduledAt || exam.startTime
                        ).toLocaleString()
                      : "Not scheduled"}
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      {onView && (
                        <Tooltip title="View exam">
                          <IconButton
                            size="small"
                            aria-label="View exam"
                            onClick={() => onView(exam)}
                          >
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {onEdit && (
                        <Tooltip title="Edit exam">
                          <IconButton
                            size="small"
                            aria-label="Edit exam"
                            onClick={() => onEdit(exam)}
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {onDelete && (
                        <Tooltip title="Delete exam">
                          <IconButton
                            size="small"
                            color="error"
                            aria-label="Delete exam"
                            onClick={() => onDelete(exam)}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}

            {!loading && paginatedExams.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    title="No exams found"
                    description="Create an exam or change your filters."
                  />
                </TableCell>
              </TableRow>
            )}

            {loading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography textAlign="center" sx={{ py: 3 }}>
                    Loading exams...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box>
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
      </Box>
    </Paper>
  );
}