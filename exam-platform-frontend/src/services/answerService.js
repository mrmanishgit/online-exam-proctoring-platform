import answerApi from "../api/answerApi";

const answerService = {
  save(attemptId, payload) {
    if (typeof answerApi.saveAnswer === "function") return answerApi.saveAnswer(attemptId, payload);
    if (typeof answerApi.save === "function") return answerApi.save(attemptId, payload);
    throw new Error("answerApi must export saveAnswer(attemptId, payload) or save(attemptId, payload).");
  },
  getForAttempt(attemptId) {
    if (typeof answerApi.getAnswersByAttempt === "function") return answerApi.getAnswersByAttempt(attemptId);
    if (typeof answerApi.getForAttempt === "function") return answerApi.getForAttempt(attemptId);
    throw new Error("answerApi must export getAnswersByAttempt(attemptId) or getForAttempt(attemptId).");
  },
};

export default answerService;
export { answerService };
