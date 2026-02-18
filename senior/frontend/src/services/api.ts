import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username: string, password: string) =>
    api.post("/auth/login", { username, password }),

  register: (username: string, password: string) =>
    api.post("/auth/register", { username, password }),
};

export const notificationAPI = {
  getMyNotifications: () => api.get("/notifications"),

  getUnreadCount: () => api.get("/notifications/unread-count"),

  markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),

  markAllAsRead: () => api.patch("/notifications/read-all"),
};

export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),

  getUsers: () => api.get("/admin/users"),

  sendNotification: (message: string, userIds: number[]) =>
    api.post("/admin/notifications", { message, userIds }),

  getSentNotifications: () => api.get("/admin/notifications"),

  getNotificationDetails: (id: number) => api.get(`/admin/notifications/${id}`),
};

export default api;
