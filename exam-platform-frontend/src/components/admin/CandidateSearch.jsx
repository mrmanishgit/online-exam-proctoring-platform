import { useEffect, useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

export default function CandidateSearch({
  value,
  onChange,
  onSearch,
  placeholder = "Search candidates by name, email, or ID",
  debounceMs = 300,
  fullWidth = true,
}) {
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (!onSearch) return undefined;

    const timer = window.setTimeout(() => {
      onSearch(internalValue.trim());
    }, Math.max(0, debounceMs));

    return () => window.clearTimeout(timer);
  }, [internalValue, debounceMs, onSearch]);

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  const clearSearch = () => {
    setInternalValue("");
    onChange?.("");
    onSearch?.("");
  };

  return (
    <TextField
      fullWidth={fullWidth}
      size="small"
      value={internalValue}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label="Search candidates"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: internalValue ? (
            <InputAdornment position="end">
              <Tooltip title="Clear search">
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={clearSearch}
                  edge="end"
                >
                  <ClearRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}