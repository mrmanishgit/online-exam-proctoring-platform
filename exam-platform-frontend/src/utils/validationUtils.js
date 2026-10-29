export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim().length > 0;

export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());

export const isValidPhone = (value) =>
  /^[+]?[\d\s()-]{7,20}$/.test(String(value ?? "").trim());

export const isStrongPassword = (value) =>
  typeof value === "string" &&
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /\d/.test(value);

export function validateFields(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = values[field];
    for (const rule of fieldRules) {
      const valid = rule.test ? rule.test(value, values) : true;
      if (!valid) {
        errors[field] = rule.message || "Invalid value.";
        break;
      }
    }
  });
  return errors;
}
