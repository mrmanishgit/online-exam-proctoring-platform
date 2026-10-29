import { Pagination as MuiPagination, Stack, Typography } from "@mui/material";

export default function Pagination({
  page,
  totalPages,
  onChange,
  totalItems,
  pageSize = 10,
}) {
  if (!totalPages || totalPages <= 1) {
    return totalItems !== undefined ? (
      <Typography variant="body2" color="text.secondary">
        {totalItems} {totalItems === 1 ? "item" : "items"}
      </Typography>
    ) : null;
  }

  const start = (page - 1) * pageSize + 1;
  const end =
    totalItems === undefined
      ? page * pageSize
      : Math.min(page * pageSize, totalItems);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      mt={3}
    >
      {totalItems !== undefined && (
        <Typography variant="body2" color="text.secondary">
          Showing {start}–{end} of {totalItems}
        </Typography>
      )}

      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_, nextPage) => onChange(nextPage)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        aria-label="Pagination"
      />
    </Stack>
  );
}