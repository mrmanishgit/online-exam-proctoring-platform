import { MenuItem, Stack, TextField } from "@mui/material";

const DEFAULT_STATUSES = [
  "All",
  "Draft",
  "Scheduled",
  "Published",
  "Active",
  "Completed",
  "Cancelled",
];

export default function ExamStatusFilter({
  value = "All",
  onChange,
  statuses = DEFAULT_STATUSES,
  size = "small",
}) {
  return (
    <Stack direction="row" spacing={1} sx={{ minWidth: 170 }}>
      <TextField
        select
        fullWidth
        size={size}
        label="Exam status"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}