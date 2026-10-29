import { isRequired, isStrongPassword, isValidEmail } from "../utils/validationUtils";

export function validateLogin(values = {}) {
  const errors = {};
  if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!isRequired(values.password)) errors.password = "Password is required.";
  return errors;
}

export function validateRegistration(values = {}) {
  const errors = {};
  if (!isRequired(values.name ?? values.fullName)) errors.name = "Name is required.";
  if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!isStrongPassword(values.password)) errors.password = "Use at least 8 characters with uppercase, lowercase, and a number.";
  if (values.confirmPassword !== undefined && values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}
