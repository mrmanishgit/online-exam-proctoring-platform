import authApi from "../api/authApi";

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const authService = {
  async login(credentials) {
    const response = await authApi.login(credentials);
    const data = response.data;

    if (data.accessToken) {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
    }

    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }

    return {
      ...data,
      user: data.user ?? data.data?.user ?? null,
    };
  },

  async register(details) {
    const response = await authApi.register(details);
    return response.data;
  },

  async logout() {
    try {
      if (localStorage.getItem(TOKEN_KEY)) {
        await authApi.logout();
      }
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  async getCurrentUser() {
    const response = await authApi.getCurrentUser();
    return response.data;
  },

  async forgotPassword(email) {
    const response = await authApi.forgotPassword(email);
    return response.data;
  },

  async resetPassword(payload) {
    const response = await authApi.resetPassword(payload);
    return response.data;
  },

  async verifyEmail(token) {
    const response = await authApi.verifyEmail(token);
    return response.data;
  },

  async resendVerification(email) {
    const response = await authApi.resendVerification(email);
    return response.data;
  },

  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export default authService;