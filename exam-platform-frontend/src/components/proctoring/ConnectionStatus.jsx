import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";

export default function ConnectionStatus({
  online,
  syncing = false,
  lastSyncedAt,
  showLabel = true,
}) {
  const isOnline =
    online === undefined ? navigator.onLine : Boolean(online);

  const label = syncing
    ? "Syncing..."
    : isOnline
      ? "Connected"
      : "Offline";

  const color = syncing ? "warning" : isOnline ? "success" : "error";

  const icon = syncing ? (
    <SyncRoundedIcon fontSize="small" />
  ) : isOnline ? (
    <WifiRoundedIcon fontSize="small" />
  ) : (
    <WifiOffRoundedIcon fontSize="small" />
  );

  const syncedLabel =
    lastSyncedAt && isOnline
      ? `Last synced ${new Date(lastSyncedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "";

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      <Tooltip title={syncedLabel || label}>
        <Chip
          size="small"
          icon={icon}
          label={showLabel ? label : undefined}
          color={color}
          variant="outlined"
        />
      </Tooltip>

      {!isOnline && (
        <Typography variant="caption" color="error">
          Check your internet connection.
        </Typography>
      )}
    </Stack>
  );
}