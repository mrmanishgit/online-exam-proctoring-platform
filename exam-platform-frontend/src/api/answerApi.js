import axiosClient from "./axiosClient";

const answerApi = {
  saveAnswer: (attemptId, payload) => axiosClient.put(`/attempts/${encodeURIComponent(attemptId)}/answers`, payload),
  getAnswersByAttempt: (attemptId) => axiosClient.get(`/attempts/${encodeURIComponent(attemptId)}/answers`),
  saveAnswers: (attemptId, answers) => axiosClient.put(`/attempts/${encodeURIComponent(attemptId)}/answers/bulk`, { answers }),
  deleteAnswer: (attemptId, questionId) => axiosClient.delete(`/attempts/${encodeURIComponent(attemptId)}/answers/${encodeURIComponent(questionId)}`),
};
export default answerApi;
