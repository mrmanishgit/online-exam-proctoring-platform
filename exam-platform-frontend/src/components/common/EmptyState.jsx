import { Box, Button, Stack, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

export default function EmptyState({
  title = "Nothing here yet",
  description = "There is no data to display right now.",
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <Box
      sx={{
        py: 7,
        px: 3,
        textAlign: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 64,
            height: 64,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            bgcolor: "action.hover",
            color: "primary.main",
          }}
        >
          {icon || <InboxOutlinedIcon sx={{ fontSize: 32 }} />}
        </Box>

        <Typography variant="h6" fontWeight={750}>
          {title}
        </Typography>

        <Typography color="text.secondary" maxWidth={420}>
          {description}
        </Typography>

        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}