import {
  Avatar,
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
import EmptyState from "../common/EmptyState";

function getStatusColor(status) {
  const normalized = String(status || "").toLowerCase();

  if (["active", "verified", "approved"].includes(normalized)) return "success";
  if (["pending", "invited"].includes(normalized)) return "warning";
  if (["blocked", "suspended", "rejected"].includes(normalized)) return "error";

  return "default";
}

export default function CandidateDataTable({
  candidates = [],
  loading = false,
  onView,
  page = 0,
  rowsPerPage = 10,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}) {
  const count = totalCount ?? candidates.length;
  const visibleCandidates =
    totalCount === undefined
      ? candidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : candidates;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleCandidates.map((candidate, index) => {
              const id = candidate.id ?? candidate.userId ?? index;
              const name =
                candidate.name ||
                `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
                "Unnamed candidate";

              const status = candidate.status || "Active";

              return (
                <TableRow hover key={id}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={candidate.avatarUrl || undefined}>
                        {name.charAt(0).toUpperCase()}
                      </Avatar>

                      <Stack spacing={0.25}>
                        <Typography fontWeight={700}>{name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {id}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>

                  <TableCell>{candidate.email || "—"}</TableCell>

                  <TableCell>
                    {String(candidate.role || "STUDENT").replaceAll("_", " ")}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={status}
                      color={getStatusColor(status)}
                    />
                  </TableCell>

                  <TableCell>
                    {candidate.createdAt
                      ? new Date(candidate.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell align="right">
                    {onView && (
                      <Tooltip title="View candidate">
                        <IconButton
                          aria-label={`View ${name}`}
                          onClick={() => onView(candidate)}
                        >
                          <VisibilityRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {!loading && visibleCandidates.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    title="No candidates found"
                    description="Try changing your search or filters."
                  />
                </TableCell>
              </TableRow>
            )}

            {loading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography textAlign="center" sx={{ py: 3 }}>
                    Loading candidates...
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