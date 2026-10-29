export function getAnsweredCount(answers = {}) {
  return Object.values(answers).filter((answer) => {
    if (answer === null || answer === undefined) return false;
    if (typeof answer === "string") return answer.trim().length > 0;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  }).length;
}

export function getUnansweredCount(totalQuestions, answers = {}) {
  return Math.max(0, Number(totalQuestions || 0) - getAnsweredCount(answers));
}

export function getQuestionStatus(questionId, { answers = {}, markedQuestions = [], currentQuestionId } = {}) {
  if (questionId === currentQuestionId) return "current";
  if (markedQuestions.includes(questionId)) return "marked";
  const answer = answers[questionId];
  const answered = answer !== null && answer !== undefined &&
    (typeof answer !== "string" || answer.trim() !== "") &&
    (!Array.isArray(answer) || answer.length > 0);
  return answered ? "answered" : "unanswered";
}

export function calculatePercentage(score, maximum) {
  const max = Number(maximum);
  if (!Number.isFinite(max) || max <= 0) return 0;
  return Math.round((Number(score || 0) / max) * 10000) / 100;
}

export function shuffleArray(items = []) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
