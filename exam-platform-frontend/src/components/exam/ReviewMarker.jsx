import { Button, Tooltip } from "@mui/material";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";

export default function ReviewMarker({
  marked = false,
  onChange,
  disabled = false,
  compact = false,
}) {
  return (
    <Tooltip title={marked ? "Remove review marker" : "Mark for review"}>
      <span>
        <Button
          size={compact ? "small" : "medium"}
          variant={marked ? "contained" : "outlined"}
          color={marked ? "warning" : "inherit"}
          startIcon={
            marked ? (
              <BookmarkRoundedIcon />
            ) : (
              <BookmarkBorderRoundedIcon />
            )
          }
          disabled={disabled}
          onClick={() => onChange?.(!marked)}
          aria-pressed={marked}
        >
          {compact ? "" : marked ? "Marked for review" : "Mark for review"}
        </Button>
      </span>
    </Tooltip>
  );
}