import axiosClient from "./axiosClient";

const questionApi = {
  getQuestions: (params) => axiosClient.get("/questions", { params }),
  getQuestionById: (id) => axiosClient.get(`/questions/${encodeURIComponent(id)}`),
  getQuestionsByExam: (examId, params) => axiosClient.get(`/exams/${encodeURIComponent(examId)}/questions`, { params }),
  createQuestion: (payload) => axiosClient.post("/questions", payload),
  updateQuestion: (id, payload) => axiosClient.put(`/questions/${encodeURIComponent(id)}`, payload),
  deleteQuestion: (id) => axiosClient.delete(`/questions/${encodeURIComponent(id)}`),
  importQuestions: (payload) => axiosClient.post("/questions/import", payload),
};
export default questionApi;
