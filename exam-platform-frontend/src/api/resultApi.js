import axiosClient from "./axiosClient";

// Generic /results CRUD is available. Student scoping and publishing require backend workflow endpoints.
const resultApi = {
  getResults: (params) => axiosClient.get("/results", { params }),
  list: (params) => axiosClient.get("/results", { params }),
  getResultById: (id) => axiosClient.get(`/results/${encodeURIComponent(id)}`),
  getResultByAttempt: (_attemptId) => axiosClient.get("/results"),
  getByAttempt: (_attemptId) => axiosClient.get("/results"),
  getMyResults: (params) => axiosClient.get("/results/me", { params }),
  publishResult: (id) => axiosClient.post(`/results/${encodeURIComponent(id)}/publish`),
};
export default resultApi;
