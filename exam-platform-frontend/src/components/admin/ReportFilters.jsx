import { Button, Grid, MenuItem, Stack, TextField } from "@mui/material";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";

export default function ReportFilters({
  filters = {},
  onChange,
  onReset,
  examOptions = [],
  showDateFilters = true,
}) {
  const update = (key, value) => {
    onChange?.({ ...filters, [key]: value });
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          select
          fullWidth
          size="small"
          label="Exam"
          value={filters.examId ?? "all"}
          onChange={(event) => update("examId", event.target.value)}
        >
          <MenuItem value="all">All exams</MenuItem>
          {examOptions.map((exam) => (
            <MenuItem key={exam.id ?? exam.examId} value={String(exam.id ?? exam.examId)}>
              {exam.title || exam.name || `Exam ${exam.id ?? exam.examId}`}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <TextField
          select
          fullWidth
          size="small"
          label="Result status"
          value={filters.status ?? "all"}
          onChange={(event) => update("status", event.target.value)}
        >
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="passed">Passed</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>
      </Grid>

      {showDateFilters && (
        <>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From date"
              InputLabelProps={{ shrink: true }}
              value={filters.fromDate ?? ""}
              onChange={(event) => update("fromDate", event.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To date"
              InputLabelProps={{ shrink: true }}
              value={filters.toDate ?? ""}
              onChange={(event) => update("toDate", event.target.value)}
            />
          </Grid>
        </>
      )}

      <Grid item xs={12} md={2}>
        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FilterAltOffRoundedIcon />}
            onClick={() =>
              onReset?.({
                examId: "all",
                status: "all",
                fromDate: "",
                toDate: "",
              })
            }
          >
            Reset
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}