import { isRequired } from "../utils/validationUtils";

export function validateQuestion(question = {}) {
  const errors = {};
  if (!isRequired(question.text ?? question.questionText)) errors.text = "Question text is required.";
  const type = String(question.type ?? question.questionType ?? "MCQ").toUpperCase();
  if (["MCQ", "MULTIPLE_CHOICE", "SINGLE_CHOICE"].includes(type)) {
    const options = Array.isArray(question.options) ? question.options : [];
    if (options.filter((option) => isRequired(typeof option === "object" ? option.text ?? option.label : option)).length < 2) {
      errors.options = "Provide at least two answer options.";
    }
    if (question.correctAnswer === undefined && question.correctOptionId === undefined && question.correctAnswers === undefined) {
      errors.correctAnswer = "Select the correct answer.";
    }
  }
  if (question.marks !== undefined && (!Number.isFinite(Number(question.marks)) || Number(question.marks) < 0)) {
    errors.marks = "Marks must be zero or greater.";
  }
  return errors;
}
