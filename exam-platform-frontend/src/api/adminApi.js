import axiosClient from "./axiosClient";

const adminApi = {
  getDashboardStats: (params) => axiosClient.get("/admin/dashboard", { params }),
  getAuditLogs: (params) => axiosClient.get("/admin/audit-logs", { params }),
  getSystemSettings: () => axiosClient.get("/admin/settings"),
  updateSystemSettings: (payload) => axiosClient.put("/admin/settings", payload),
  getDepartments: (params) => axiosClient.get("/admin/departments", { params }),
  createDepartment: (payload) => axiosClient.post("/admin/departments", payload),
  updateDepartment: (id, payload) => axiosClient.put(`/admin/departments/${encodeURIComponent(id)}`, payload),
  deleteDepartment: (id) => axiosClient.delete(`/admin/departments/${encodeURIComponent(id)}`),
};
export default adminApi;
