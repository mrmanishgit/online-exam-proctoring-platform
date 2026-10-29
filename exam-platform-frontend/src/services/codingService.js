import codingApi from "../api/codingApi";

const codingService = {
  run(payload) {
    if (typeof codingApi.runCode === "function") return codingApi.runCode(payload);
    if (typeof codingApi.execute === "function") return codingApi.execute(payload);
    throw new Error("codingApi must export runCode(payload) or execute(payload).");
  },
  submit(payload) {
    if (typeof codingApi.submitCode === "function") return codingApi.submitCode(payload);
    if (typeof codingApi.submit === "function") return codingApi.submit(payload);
    throw new Error("codingApi must export submitCode(payload) or submit(payload).");
  },
  getSubmissions(params) {
    if (typeof codingApi.getSubmissions === "function") return codingApi.getSubmissions(params);
    if (typeof codingApi.listSubmissions === "function") return codingApi.listSubmissions(params);
    throw new Error("codingApi must export getSubmissions(params) or listSubmissions(params).");
  },
};

export default codingService;
export { codingService };
