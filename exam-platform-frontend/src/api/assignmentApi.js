import axiosClient from "./axiosClient";

const assignmentApi = {
  assign: (payload) => axiosClient.post("/exam-assignments", payload),
  getAssignedByMe: () => axiosClient.get("/employee/exams"),
  getCandidateAttempts: () => axiosClient.get("/employee/attempts"),
};
export default assignmentApi;
