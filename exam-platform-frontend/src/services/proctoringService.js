import proctoringApi from "../api/proctoringApi";

const proctoringService = {
  recordEvent(payload) {
    if (typeof proctoringApi.recordEvent === "function") return proctoringApi.recordEvent(payload);
    if (typeof proctoringApi.createEvent === "function") return proctoringApi.createEvent(payload);
    throw new Error("proctoringApi must export recordEvent(payload) or createEvent(payload).");
  },
  getEvents(params) {
    if (typeof proctoringApi.getEvents === "function") return proctoringApi.getEvents(params);
    if (typeof proctoringApi.listEvents === "function") return proctoringApi.listEvents(params);
    throw new Error("proctoringApi must export getEvents(params) or listEvents(params).");
  },
};

export default proctoringService;
export { proctoringService };
