import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import PageHeader from "../../components/common/PageHeader";
import { downloadTextFile } from "../../utils/downloadUtils";

const reportData = [
  { id: 1, exam: "Java Developer Assessment", candidates: 120, completed: 96, flagged: 8, average: 78 },
  { id: 2, exam: "Python Coding Test", candidates: 85, completed: 72, flagged: 5, average: 82 },
  { id: 3, exam: "Aptitude Assessment", candidates: 150, completed: 131, flagged: 12, average: 69 },
  { id: 4, exam: "Frontend Developer Test", candidates: 64, completed: 58, flagged: 3, average: 85 },
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");

  const reports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reportData.filter((report) => {
      const matchesSearch = report.exam.toLowerCase().includes(query);
      const matchesPeriod = period === "all" || report.completed > 0;
      return matchesSearch && matchesPeriod;
    });
  }, [search, period]);

  const totalCandidates = reports.reduce((sum, item) => sum + item.candidates, 0);
  const totalCompleted = reports.reduce((sum, item) => sum + item.completed, 0);
  const totalFlagged = reports.reduce((sum, item) => sum + item.flagged, 0);
  const averageScore = reports.length
    ? Math.round(reports.reduce((sum, item) => sum + item.average, 0) / reports.length)
    : 0;

  const exportReport = () => {
    const headers = ["Exam", "Candidates", "Completed", "Flagged", "Average Score (%)"];
    const rows = reports.map((item) => [
      item.exam,
      item.candidates,
      item.completed,
      item.flagged,
      item.average,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    downloadTextFile(
      `exam-reports-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      "text/csv;charset=utf-8;"
    );
  };

  const stats = [
    { label: "Total candidates", value: totalCandidates, color: "#2563eb" },
    { label: "Completed attempts", value: totalCompleted, color: "#059669" },
    { label: "Flagged attempts", value: totalFlagged, color: "#d97706" },
    { label: "Average score", value: `${averageScore}%`, color: "#7c3aed" },
  ];

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Review exam performance and export summary reports."
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.label}>
            <Card sx={{ height: "100%", borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ mt: 1, color: stat.color }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
                Exam performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Summary of candidate activity and exam results
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<DownloadRoundedIcon />}
              onClick={exportReport}
              disabled={!reports.length}
            >
              Export CSV
            </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <TextField
              fullWidth
              size="small"
              label="Search exams"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <TextField
              select
              size="small"
              label="Reporting period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">All periods</MenuItem>
              <MenuItem value="recent">Recent activity</MenuItem>
            </TextField>
          </Stack>

          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <Box component="thead">
                <Box component="tr">
                  {["Exam", "Candidates", "Completed", "Flagged", "Avg. score", "Completion"].map(
                    (heading) => (
                      <Box
                        component="th"
                        key={heading}
                        sx={{
                          textAlign: "left",
                          p: 1.5,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          color: "text.secondary",
                          fontSize: 13,
                        }}
                      >
                        {heading}
                      </Box>
                    )
                  )}
                </Box>
              </Box>

              <Box component="tbody">
                {reports.map((report) => {
                  const completion = report.candidates
                    ? Math.round((report.completed / report.candidates) * 100)
                    : 0;

                  return (
                    <Box component="tr" key={report.id}>
                      <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AssessmentRoundedIcon color="primary" fontSize="small" />
                          <Typography fontWeight={600}>{report.exam}</Typography>
                        </Stack>
                      </Box>
                      {[report.candidates, report.completed, report.flagged, `${report.average}%`, `${completion}%`].map(
                        (value, index) => (
                          <Box
                            component="td"
                            key={`${report.id}-${index}`}
                            sx={{
                              p: 1.5,
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {value}
                          </Box>
                        )
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {!reports.length && (
            <Typography color="text.secondary" textAlign="center" sx={{ py: 5 }}>
              No reports match your search.
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
            Sample report data. Connect the reports API to display live platform results.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}