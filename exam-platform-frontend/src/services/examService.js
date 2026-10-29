import examApi from "../api/examApi";

const examService = {
  list(params) {
    if (typeof examApi.getExams === "function") return examApi.getExams(params);
    if (typeof examApi.list === "function") return examApi.list(params);
    throw new Error("examApi must export getExams(params) or list(params).");
  },
  getById(id) {
    if (typeof examApi.getExamById === "function") return examApi.getExamById(id);
    if (typeof examApi.getById === "function") return examApi.getById(id);
    throw new Error("examApi must export getExamById(id) or getById(id).");
  },
  create(payload) {
    if (typeof examApi.createExam === "function") return examApi.createExam(payload);
    if (typeof examApi.create === "function") return examApi.create(payload);
    throw new Error("examApi must export createExam(payload) or create(payload).");
  },
  update(id, payload) {
    if (typeof examApi.updateExam === "function") return examApi.updateExam(id, payload);
    if (typeof examApi.update === "function") return examApi.update(id, payload);
    throw new Error("examApi must export updateExam(id, payload) or update(id, payload).");
  },
  remove(id) {
    if (typeof examApi.deleteExam === "function") return examApi.deleteExam(id);
    if (typeof examApi.remove === "function") return examApi.remove(id);
    throw new Error("examApi must export deleteExam(id) or remove(id).");
  },
};

export default examService;
export { examService };
