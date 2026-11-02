import axiosClient from "./axiosClient";

const adminApi = {
  getDashboardStats: (params) => axiosClient.get("/admin/dashboard", { params }),
  getAuditLogs: (params) => axiosClient.get("/audit-logs", { params }),
  getSystemSettings: () => axiosClient.get("/system-settings"),
  updateSystemSettings: (payload) => axiosClient.put("/system-settings", payload),
  getDepartments: (params) => axiosClient.get("/departments", { params }),
  createDepartment: (payload) => axiosClient.post("/departments", payload),
  updateDepartment: (id, payload) => axiosClient.put(`/departments/${encodeURIComponent(id)}`, payload),
  deleteDepartment: (id) => axiosClient.delete(`/departments/${encodeURIComponent(id)}`),
};
export default adminApi;
