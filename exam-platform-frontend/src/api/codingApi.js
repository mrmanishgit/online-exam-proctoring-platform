import axiosClient from "./axiosClient";

const codingApi = {
  runCode: (payload) => axiosClient.post("/coding/run", payload),
  execute: (payload) => axiosClient.post("/coding/run", payload),
  submitCode: (payload) => axiosClient.post("/coding/submissions", payload),
  submit: (payload) => axiosClient.post("/coding/submissions", payload),
  getSubmissions: (params) => axiosClient.get("/coding/submissions", { params }),
  listSubmissions: (params) => axiosClient.get("/coding/submissions", { params }),
  getSubmissionById: (id) => axiosClient.get(`/coding/submissions/${encodeURIComponent(id)}`),
  getProblem: (id) => axiosClient.get(`/coding/problems/${encodeURIComponent(id)}`),
};
export default codingApi;
