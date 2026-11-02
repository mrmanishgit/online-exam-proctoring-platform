import axiosClient from "./axiosClient";

const proctoringApi = {
  recordEvent: (payload) => axiosClient.post("/proctoring/events", payload),
  getEvents: () => axiosClient.get("/proctoring/events"),
  getEventsByAttempt: (attemptId) => axiosClient.get(`/proctoring/attempts/${encodeURIComponent(attemptId)}/events`),
  reviewEvent: (id) => axiosClient.patch(`/proctoring/events/${encodeURIComponent(id)}/review`),
  getLiveSessions: () => axiosClient.get("/proctoring/admin/monitoring/sessions"),
};
export default proctoringApi;
