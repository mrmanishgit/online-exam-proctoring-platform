import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";

const initialNotifications = [
  {
    id: 1,
    title: "Exam scheduled",
    message: "Java Developer Assessment is scheduled for the upcoming examination window.",
    category: "Exam",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Proctoring alert",
    message: "A candidate session requires review for a flagged proctoring event.",
    category: "Proctoring",
    time: "35 minutes ago",
    read: false,
  },
  {
    id: 3,
    title: "Results available",
    message: "The Python Coding Test results are ready for review.",
    category: "Results",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 4,
    title: "System reminder",
    message: "Review upcoming exam schedules and invitation status.",
    category: "System",
    time: "Yesterday",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const visibleNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const markAllRead = () => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications((items) =>
      items.map((item) =>
        item.id === id ? { ...item, read: !item.read } : item
      )
    );
  };

  const removeNotification = (id) => {
    setNotifications((items) => items.filter((item) => item.id !== id));
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <Box>
      <PageHeader
        title="Notifications"
        subtitle="Review platform updates, exam events, and proctoring alerts."
      />

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ sm: "center" }}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Notification center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
              </Typography>
            </Box>

            <Button
              startIcon={<DoneAllRoundedIcon />}
              variant="outlined"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
            {[
              ["all", "All"],
              ["unread", "Unread"],
              ["read", "Read"],
            ].map(([value, label]) => (
              <Chip
                key={value}
                label={label}
                clickable
                color={filter === value ? "primary" : "default"}
                variant={filter === value ? "filled" : "outlined"}
                onClick={() => setFilter(value)}
              />
            ))}
          </Stack>

          <Divider />

          {visibleNotifications.length ? (
            visibleNotifications.map((notification) => (
              <Box key={notification.id}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                  sx={{
                    py: 2.5,
                    px: 1,
                    bgcolor: notification.read ? "transparent" : "action.hover",
                    borderRadius: 2,
                  }}
                >
                  <NotificationsActiveRoundedIcon
                    color={notification.read ? "disabled" : "primary"}
                    sx={{ mt: 0.5 }}
                  />

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      alignItems={{ sm: "center" }}
                    >
                      <Typography fontWeight={700}>
                        {notification.title}
                      </Typography>
                      <Chip size="small" label={notification.category} />
                      {!notification.read && (
                        <Chip size="small" color="primary" label="New" />
                      )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                      {notification.message}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {notification.time}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => toggleRead(notification.id)}
                      >
                        Mark as {notification.read ? "unread" : "read"}
                      </Button>
                    </Stack>
                  </Box>

                  <IconButton
                    aria-label="Delete notification"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                </Stack>
                <Divider />
              </Box>
            ))
          ) : (
            <EmptyState
              title="No notifications"
              description="There are no notifications in this filter."
            />
          )}

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
            Notifications are currently sample data stored in this page state.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}