import axiosClient from "./axiosClient";

const attemptApi = {
  startAttempt: (examId) => axiosClient.post(`/attempts/start/${encodeURIComponent(examId)}`),
  getQuestions: (attemptId) => axiosClient.get(`/attempts/${encodeURIComponent(attemptId)}/questions`),
  getAttemptById: (id) => axiosClient.get(`/exam-attempts/${encodeURIComponent(id)}`),
  getMyAttempts: (params) => axiosClient.get("/attempts/me", { params }),
  getAttempts: (params) => axiosClient.get("/exam-attempts", { params }),
  saveAnswer: (attemptId, payload) => axiosClient.put(`/attempts/${encodeURIComponent(attemptId)}/answers`, payload),
  submitAttempt: (attemptId) => axiosClient.post(`/attempts/${encodeURIComponent(attemptId)}/submit`),
};
export default attemptApi;
