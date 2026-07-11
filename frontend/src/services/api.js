// frontend/src/services/api.js
import apiClient from "./apiClient";

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  register:       (data)  => apiClient.post("/auth/register", data),
  login:          (data)  => apiClient.post("/auth/login", data),
  logout:         ()      => apiClient.post("/auth/logout"),
  refreshToken:   ()      => apiClient.post("/auth/refresh-token"),
  forgotPassword: (email) => apiClient.post("/auth/forgot-password", { email }),
  resetPassword:  (token, password) => apiClient.patch(`/auth/reset-password/${token}`, { password }),
  verifyEmail:    (token) => apiClient.get(`/auth/verify-email/${token}`),
};

// ── Users ─────────────────────────────────────────────────────────────────
export const userApi = {
  getMe:          ()           => apiClient.get("/users/me"),
  updateProfile:  (data)       => apiClient.patch("/users/me", data),
  editProfile:    (data)       => apiClient.patch("/users/edit", data),
  getSaved:       ()           => apiClient.get("/users/saved"),
  toggleSave:     (listingId)  => apiClient.post(`/users/saved/${listingId}`),
  getPublicProfile: (id)       => apiClient.get(`/users/${id}`),
};

// ── Cloudinary ────────────────────────────────────────────────────────────
export const cloudinaryApi = {
  signUpload: () => apiClient.post("/cloudinary/sign"),
};

// ── Listings ──────────────────────────────────────────────────────────────
export const listingApi = {
  getAll:     (params)      => apiClient.get("/listings", { params }),
  getOne:     (id)          => apiClient.get(`/listings/${id}`),
  getMine:    ()            => apiClient.get("/listings/mine"),
  create:     (formData)    => apiClient.post("/listings", formData),
  update:     (id, formData) => apiClient.patch(`/listings/${id}`, formData),
  remove:     (id)           => apiClient.delete(`/listings/${id}`),
};

// ── Messages ──────────────────────────────────────────────────────────────
export const messageApi = {
  send:           (data)   => apiClient.post("/messages/send", data),
  getInbox:       ()       => apiClient.get("/messages/inbox"),
  getConversation:(userId) => apiClient.get(`/messages/with/${userId}`),
  getUnreadCount: ()       => apiClient.get("/messages/unread"),
};

// ── Matches ───────────────────────────────────────────────────────────────
export const matchApi = {
  getSeekers:     (params)   => apiClient.get("/matches/seekers", { params }),
  inviteToTeam:   (targetId) => apiClient.post(`/matches/invite/${targetId}`),
  leaveTeam:      ()         => apiClient.delete("/matches/team"),
};
