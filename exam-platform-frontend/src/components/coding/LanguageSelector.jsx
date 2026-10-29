import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const LANGUAGES = [
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "cpp", label: "C++" },
];

export default function LanguageSelector({
  value = "java",
  onChange,
  disabled = false,
  languages = LANGUAGES,
}) {
  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="code-language-label">Language</InputLabel>
      <Select
        labelId="code-language-label"
        value={value}
        label="Language"
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {languages.map((language) => (
          <MenuItem key={language.value} value={language.value}>
            {language.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}