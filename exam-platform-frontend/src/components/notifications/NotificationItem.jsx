import { Box, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

export default function NotificationItem({ notification, onClick }) {
  if (!notification) return null;
  const title = notification.title ?? notification.subject ?? "Notification";
  const message = notification.message ?? notification.body ?? "";
  const read = Boolean(notification.read ?? notification.isRead);

  return (
    <ListItem disablePadding secondaryAction={null}>
      <ListItemButton onClick={() => onClick?.(notification)} alignItems="flex-start">
        <Box sx={{ minWidth: 18, pt: 1, color: read ? "transparent" : "primary.main" }}>
          <CircleIcon sx={{ fontSize: 8 }} />
        </Box>
        <ListItemText
          primary={<Typography fontWeight={read ? 400 : 700}>{title}</Typography>}
          secondary={
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">{message}</Typography>
              {notification.createdAt && <Typography variant="caption" color="text.secondary">{notification.createdAt}</Typography>}
            </Stack>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}
