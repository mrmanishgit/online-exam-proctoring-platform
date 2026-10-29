import { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

export default function PasswordField({
  label = "Password",
  name = "password",
  value,
  onChange,
  error = false,
  helperText = "",
  required = true,
  autoComplete = "current-password",
  disabled = false,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      fullWidth
      name={name}
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      inputProps={{ minLength: 8 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((current) => !current)}
              edge="end"
              disabled={disabled}
            >
              {visible ? (
                <VisibilityOffRoundedIcon />
              ) : (
                <VisibilityRoundedIcon />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}