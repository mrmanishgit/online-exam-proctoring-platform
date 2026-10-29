import axiosClient from "./axiosClient";

const reportApi = {
  getDashboardReport: (params) => axiosClient.get("/reports/dashboard", { params }),
  getExamReport: (examId, params) => axiosClient.get(`/reports/exams/${encodeURIComponent(examId)}`, { params }),
  getCandidateReport: (candidateId, params) => axiosClient.get(`/reports/candidates/${encodeURIComponent(candidateId)}`, { params }),
  getProctoringReport: (params) => axiosClient.get("/reports/proctoring", { params }),
  exportReport: (payload) => axiosClient.post("/reports/export", payload, { responseType: "blob" }),
};
export default reportApi;
