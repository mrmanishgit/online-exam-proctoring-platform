import axiosClient from "./axiosClient";

const invitationApi = {
  getInvitations: (params) => axiosClient.get("/invitations", { params }),
  createInvitation: (payload) => axiosClient.post("/invitations", payload),
  resendInvitation: (id) => axiosClient.post(`/invitations/${encodeURIComponent(id)}/resend`),
  revokeInvitation: (id) => axiosClient.delete(`/invitations/${encodeURIComponent(id)}`),
  acceptInvitation: (token, payload = {}) => axiosClient.post(`/invitations/${encodeURIComponent(token)}/accept`, payload),
};
export default invitationApi;
