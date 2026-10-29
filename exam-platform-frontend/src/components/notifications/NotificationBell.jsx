import { Badge, IconButton, Tooltip } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export default function NotificationBell({ count = 0, onClick, label = "Notifications" }) {
  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} onClick={onClick}>
        <Badge badgeContent={count > 99 ? "99+" : count} color="error">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
