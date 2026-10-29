import axiosClient from "./axiosClient";

const notificationApi = {
  getNotifications: (params) => axiosClient.get("/notifications", { params }),
  list: (params) => axiosClient.get("/notifications", { params }),
  markAsRead: (id) => axiosClient.patch(`/notifications/${encodeURIComponent(id)}/read`),
  markRead: (id) => axiosClient.patch(`/notifications/${encodeURIComponent(id)}/read`),
  markAllAsRead: () => axiosClient.patch("/notifications/read-all"),
  deleteNotification: (id) => axiosClient.delete(`/notifications/${encodeURIComponent(id)}`),
};
export default notificationApi;
