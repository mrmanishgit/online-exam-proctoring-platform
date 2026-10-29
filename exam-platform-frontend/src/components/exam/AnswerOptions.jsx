import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

function getOptionValue(option) {
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }

  return String(option.id ?? option.value ?? option.optionId ?? option.label ?? "");
}

function getOptionLabel(option) {
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }

  return String(option.text ?? option.label ?? option.value ?? option.content ?? "");
}

export default function AnswerOptions({
  options = [],
  value,
  onChange,
  disabled = false,
  questionType = "SINGLE_CHOICE",
}) {
  const isMultiple =
    ["MULTIPLE_CHOICE", "MULTI_SELECT", "MULTIPLE_SELECT"].includes(
      String(questionType).toUpperCase()
    );

  const normalizedOptions = options.map((option, index) => ({
    original: option,
    value: getOptionValue(option) || String(index),
    label: getOptionLabel(option),
  }));

  if (!normalizedOptions.length) {
    return (
      <Typography color="text.secondary">
        No answer options are available for this question.
      </Typography>
    );
  }

  const selectedValues = Array.isArray(value)
    ? value.map(String)
    : value === undefined || value === null || value === ""
      ? []
      : [String(value)];

  const handleMultipleChange = (optionValue, checked) => {
    const nextValues = checked
      ? [...new Set([...selectedValues, optionValue])]
      : selectedValues.filter((item) => item !== optionValue);

    onChange?.(nextValues);
  };

  if (isMultiple) {
    return (
      <Stack spacing={1.25}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Select all answers that apply.
        </Typography>

        {normalizedOptions.map((option, index) => {
          const selected = selectedValues.includes(option.value);

          return (
            <Box
              key={`${option.value}-${index}`}
              sx={{
                p: 1.5,
                border: "1px solid",
                borderColor: selected ? "primary.main" : "divider",
                bgcolor: selected ? "action.selected" : "background.paper",
                borderRadius: 2,
              }}
            >
              <FormControlLabel
                disabled={disabled}
                sx={{ m: 0, width: "100%" }}
                control={
                  <Checkbox
                    checked={selected}
                    onChange={(event) =>
                      handleMultipleChange(option.value, event.target.checked)
                    }
                  />
                }
                label={
                  <Typography variant="body1">
                    {option.label}
                  </Typography>
                }
              />
            </Box>
          );
        })}
      </Stack>
    );
  }

  return (
    <RadioGroup
      value={selectedValues[0] ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
    >
      <Stack spacing={1.25}>
        {normalizedOptions.map((option, index) => {
          const selected = selectedValues[0] === option.value;

          return (
            <Box
              key={`${option.value}-${index}`}
              sx={{
                p: 1.5,
                border: "1px solid",
                borderColor: selected ? "primary.main" : "divider",
                bgcolor: selected ? "action.selected" : "background.paper",
                borderRadius: 2,
              }}
            >
              <FormControlLabel
                value={option.value}
                disabled={disabled}
                sx={{ m: 0, width: "100%" }}
                control={<Radio />}
                label={
                  <Typography variant="body1">
                    {option.label}
                  </Typography>
                }
              />
            </Box>
          );
        })}
      </Stack>
    </RadioGroup>
  );
}