import notificationApi from "../api/notificationApi";

const notificationService = {
  list(params) {
    if (typeof notificationApi.getNotifications === "function") return notificationApi.getNotifications(params);
    if (typeof notificationApi.list === "function") return notificationApi.list(params);
    throw new Error("notificationApi must export getNotifications(params) or list(params).");
  },
  markRead(id) {
    if (typeof notificationApi.markAsRead === "function") return notificationApi.markAsRead(id);
    if (typeof notificationApi.markRead === "function") return notificationApi.markRead(id);
    throw new Error("notificationApi must export markAsRead(id) or markRead(id).");
  },
  markAllRead() {
    if (typeof notificationApi.markAllAsRead === "function") return notificationApi.markAllAsRead();
    throw new Error("notificationApi must export markAllAsRead().");
  },
};

export default notificationService;
export { notificationService };
