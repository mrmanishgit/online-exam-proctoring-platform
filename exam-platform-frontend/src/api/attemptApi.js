import axiosClient from "./axiosClient";

const attemptApi = {
  startAttempt: (examId, payload = {}) => axiosClient.post(`/exams/${encodeURIComponent(examId)}/attempts`, payload),
  getAttemptById: (id) => axiosClient.get(`/attempts/${encodeURIComponent(id)}`),
  getMyAttempts: (params) => axiosClient.get("/attempts/me", { params }),
  getAttempts: (params) => axiosClient.get("/attempts", { params }),
  submitAttempt: (id, payload = {}) => axiosClient.post(`/attempts/${encodeURIComponent(id)}/submit`, payload),
  saveAttempt: (id, payload) => axiosClient.patch(`/attempts/${encodeURIComponent(id)}`, payload),
};
export default attemptApi;
