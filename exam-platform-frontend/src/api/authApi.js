import axiosClient from "./axiosClient";

const authApi = {
  login: (credentials) => axiosClient.post("/auth/login", credentials),

  register: (details) => axiosClient.post("/auth/register", details),

  logout: () => axiosClient.post("/auth/logout"),

  refreshToken: (refreshToken) =>
    axiosClient.post("/auth/refresh", { refreshToken }),

  verifyEmail: (token) =>
    axiosClient.get("/auth/verify-email", {
      params: { token },
    }),

  resendVerification: (email) =>
    axiosClient.post("/auth/resend-verification", { email }),

  forgotPassword: (email) =>
    axiosClient.post("/auth/forgot-password", { email }),

  resetPassword: (payload) =>
    axiosClient.post("/auth/reset-password", payload),

  getCurrentUser: () => axiosClient.get("/users/me"),
};

export default authApi;