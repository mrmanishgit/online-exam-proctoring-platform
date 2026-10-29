import axiosClient from "./axiosClient";

const proctoringApi = {
  recordEvent: (payload) => axiosClient.post("/proctoring/events", payload),
  createEvent: (payload) => axiosClient.post("/proctoring/events", payload),
  getEvents: (params) => axiosClient.get("/proctoring/events", { params }),
  listEvents: (params) => axiosClient.get("/proctoring/events", { params }),
  getEventsByAttempt: (attemptId, params) => axiosClient.get(`/proctoring/attempts/${encodeURIComponent(attemptId)}/events`, { params }),
  reviewEvent: (id, payload) => axiosClient.patch(`/proctoring/events/${encodeURIComponent(id)}/review`, payload),
  getLiveSessions: (params) => axiosClient.get("/proctoring/live-sessions", { params }),
};
export default proctoringApi;
