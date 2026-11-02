import axiosClient from "./axiosClient";

// The supplied backend exposes generic /answers CRUD, not attempt-scoped autosave/bulk routes.
const answerApi = {
  saveAnswer: (_attemptId, payload) => payload?.id
    ? axiosClient.put(`/answers/${encodeURIComponent(payload.id)}`, payload)
    : axiosClient.post("/answers", payload),
  getAnswersByAttempt: (_attemptId) => axiosClient.get("/answers"),
  saveAnswers: (_attemptId, answers) => Promise.all((answers || []).map((answer) =>
    answer?.id ? axiosClient.put(`/answers/${encodeURIComponent(answer.id)}`, answer) : axiosClient.post("/answers", answer)
  )),
  deleteAnswer: (_attemptId, answerId) => axiosClient.delete(`/answers/${encodeURIComponent(answerId)}`),
};
export default answerApi;
