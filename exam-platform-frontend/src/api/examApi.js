import axiosClient from "./axiosClient";

const examApi = {
  getExams: (params) => axiosClient.get("/exams", { params }),
  getExamById: (id) => axiosClient.get(`/exams/${encodeURIComponent(id)}`),
  createExam: (payload) => axiosClient.post("/exams", payload),
  updateExam: (id, payload) => axiosClient.put(`/exams/${encodeURIComponent(id)}`, payload),
  deleteExam: (id) => axiosClient.delete(`/exams/${encodeURIComponent(id)}`),
  publishExam: (id) => axiosClient.post(`/exams/${encodeURIComponent(id)}/publish`),
  cancelExam: (id) => axiosClient.post(`/exams/${encodeURIComponent(id)}/cancel`),
  getAvailableExams: (params) => axiosClient.get("/exams/available", { params }),
  getAssignedExams: (params) => axiosClient.get("/exams/assigned", { params }),
};
export default examApi;
