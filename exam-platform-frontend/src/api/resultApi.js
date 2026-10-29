import axiosClient from "./axiosClient";

const resultApi = {
  getResults: (params) => axiosClient.get("/results", { params }),
  list: (params) => axiosClient.get("/results", { params }),
  getResultById: (id) => axiosClient.get(`/results/${encodeURIComponent(id)}`),
  getResultByAttempt: (attemptId) => axiosClient.get(`/attempts/${encodeURIComponent(attemptId)}/result`),
  getByAttempt: (attemptId) => axiosClient.get(`/attempts/${encodeURIComponent(attemptId)}/result`),
  getMyResults: (params) => axiosClient.get("/results/me", { params }),
  publishResult: (id) => axiosClient.post(`/results/${encodeURIComponent(id)}/publish`),
};
export default resultApi;
