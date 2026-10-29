import { Button, Divider, List, Stack, Typography } from "@mui/material";
import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications = [], onSelect, onMarkAllRead, emptyMessage = "You're all caught up." }) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography variant="h6" fontWeight={700}>Notifications</Typography>
        {notifications.some((item) => !(item.read ?? item.isRead)) && (
          <Button size="small" onClick={onMarkAllRead}>Mark all as read</Button>
        )}
      </Stack>
      {notifications.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 3 }}>{emptyMessage}</Typography>
      ) : (
        <List disablePadding divider>
          {notifications.map((item, index) => (
            <div key={item.id ?? item.notificationId ?? index}>
              <NotificationItem notification={item} onClick={onSelect} />
              {index < notifications.length - 1 && <Divider component="li" />}
            </div>
          ))}
        </List>
      )}
    </Stack>
  );
}
