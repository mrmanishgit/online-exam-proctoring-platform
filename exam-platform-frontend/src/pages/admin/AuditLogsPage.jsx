import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

const auditLogs = [
  { id: 1, actor: "admin@example.com", action: "Created exam", resource: "Java Developer Assessment", category: "Exam", timestamp: "2026-10-29T09:15:00", status: "Success" },
  { id: 2, actor: "employee@example.com", action: "Reviewed proctoring event", resource: "Attempt #1042", category: "Proctoring", timestamp: "2026-10-29T09:03:00", status: "Success" },
  { id: 3, actor: "admin@example.com", action: "Updated candidate status", resource: "Candidate #205", category: "User", timestamp: "2026-10-29T08:45:00", status: "Success" },
  { id: 4, actor: "unknown", action: "Failed login attempt", resource: "Admin sign-in", category: "Security", timestamp: "2026-10-29T08:30:00", status: "Failed" },
  { id: 5, actor: "admin@example.com", action: "Published results", resource: "Python Coding Test", category: "Results", timestamp: "2026-10-28T16:20:00", status: "Success" },
  { id: 6, actor: "employee@example.com", action: "Exported report", resource: "October Exam Summary", category: "Report", timestamp: "2026-10-28T15:40:00", status: "Success" },
  { id: 7, actor: "admin@example.com", action: "Sent exam invitations", resource: "Frontend Assessment", category: "Invitation", timestamp: "2026-10-28T14:05:00", status: "Success" },
  { id: 8, actor: "unknown", action: "Unauthorized access", resource: "Admin dashboard", category: "Security", timestamp: "2026-10-28T12:50:00", status: "Failed" },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return auditLogs.filter((log) => {
      const matchesSearch = [
        log.actor,
        log.action,
        log.resource,
        log.category,
      ].some((value) => value.toLowerCase().includes(query));

      return matchesSearch && (category === "all" || log.category === category);
    });
  }, [search, category]);

  const pageCount = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDate = (value) =>
    new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const exportLogs = () => {
    const headers = ["Actor", "Action", "Resource", "Category", "Timestamp", "Status"];
    const rows = filteredLogs.map((log) => [
      log.actor,
      log.action,
      log.resource,
      log.category,
      log.timestamp,
      log.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <PageHeader
        title="Audit Logs"
        subtitle="Review account activity, security events, and administrative actions."
      />

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Activity history
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredLogs.length} records found
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                size="small"
                label="Search logs"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
              <TextField
                select
                size="small"
                label="Category"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All categories</MenuItem>
                {["Exam", "Proctoring", "User", "Security", "Results", "Report", "Invitation"].map(
                  (item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  )
                )}
              </TextField>
              <Box
                component="button"
                type="button"
                onClick={exportLogs}
                sx={{
                  px: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  cursor: "pointer",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Export CSV
              </Box>
            </Stack>
          </Stack>

          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <Box component="thead">
                <Box component="tr">
                  {["Actor", "Action", "Resource", "Category", "Date & time", "Status"].map(
                    (heading) => (
                      <Box
                        component="th"
                        key={heading}
                        sx={{
                          p: 1.5,
                          textAlign: "left",
                          fontSize: 13,
                          color: "text.secondary",
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {heading}
                      </Box>
                    )
                  )}
                </Box>
              </Box>
              <Box component="tbody">
                {currentLogs.map((log) => (
                  <Box component="tr" key={log.id}>
                    <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider", whiteSpace: "nowrap" }}>
                      {log.actor}
                    </Box>
                    <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                      {log.action}
                    </Box>
                    <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                      {log.resource}
                    </Box>
                    <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Chip size="small" label={log.category} variant="outlined" />
                    </Box>
                    <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider", whiteSpace: "nowrap" }}>
                      {formatDate(log.timestamp)}
                    </Box>
                    <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Chip
                        size="small"
                        label={log.status}
                        color={log.status === "Success" ? "success" : "error"}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {!currentLogs.length && (
            <EmptyState
              title="No audit records found"
              description="Try changing your search or category filter."
            />
          )}

          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onChange={setPage}
          />

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
            Sample audit records. Production audit logs should be retrieved from the backend and protected from client-side modification.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}