import { InputAdornment, TextField } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import IconButton from "@mui/material/IconButton";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  fullWidth = true,
  disabled = false,
}) {
  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      disabled={disabled}
      inputProps={{ "aria-label": placeholder }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="Clear search"
              size="small"
              onClick={() => onChange("")}
              disabled={disabled}
            >
              <ClearRoundedIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          bgcolor: "background.paper",
        },
      }}
    />
  );
}