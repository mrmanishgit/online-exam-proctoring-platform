import resultApi from "../api/resultApi";

const resultService = {
  getByAttempt(attemptId) {
    if (typeof resultApi.getResultByAttempt === "function") return resultApi.getResultByAttempt(attemptId);
    if (typeof resultApi.getByAttempt === "function") return resultApi.getByAttempt(attemptId);
    throw new Error("resultApi must export getResultByAttempt(attemptId) or getByAttempt(attemptId).");
  },
  list(params) {
    if (typeof resultApi.getResults === "function") return resultApi.getResults(params);
    if (typeof resultApi.list === "function") return resultApi.list(params);
    throw new Error("resultApi must export getResults(params) or list(params).");
  },
};

export default resultService;
export { resultService };
