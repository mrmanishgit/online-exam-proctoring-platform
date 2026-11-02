import axiosClient from "./axiosClient";

const userApi = {
  getUsers: (params) => axiosClient.get("/admin/users", { params }),
  getStudents: () => axiosClient.get("/workflow/students"),
  getUserById: (id) => axiosClient.get(`/users/${encodeURIComponent(id)}`),
  createUser: (payload) => axiosClient.post("/admin/users", payload),
  updateUser: (id, payload) => axiosClient.put(`/users/${encodeURIComponent(id)}`, payload),
  deleteUser: (id) => axiosClient.delete(`/users/${encodeURIComponent(id)}`),
  updateUserStatus: (id, status) => axiosClient.patch(`/users/${encodeURIComponent(id)}/status`, { status }),
  getCurrentUser: () => axiosClient.get("/users/me"),
  updateCurrentUser: (payload) => axiosClient.patch("/users/me", payload),
};
export default userApi;
