import { isRequired } from "../utils/validationUtils";

export function validateExam(values = {}) {
  const errors = {};
  if (!isRequired(values.title)) errors.title = "Exam title is required.";
  const duration = Number(values.durationMinutes ?? values.duration);
  if (!Number.isFinite(duration) || duration <= 0) errors.durationMinutes = "Duration must be greater than zero.";
  const totalMarks = Number(values.totalMarks);
  if (values.totalMarks !== undefined && (!Number.isFinite(totalMarks) || totalMarks < 0)) {
    errors.totalMarks = "Total marks cannot be negative.";
  }
  if (values.startAt && values.endAt && new Date(values.endAt) <= new Date(values.startAt)) {
    errors.endAt = "End time must be after start time.";
  }
  return errors;
}
