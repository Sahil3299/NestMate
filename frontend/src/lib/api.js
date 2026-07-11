import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_PREFIX = "/api/v1";
const TOKEN_KEYS = ["accessToken", "nestmate_token"];

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = TOKEN_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Listing APIs
export const listingAPI = {
  create: (data) => api.post(`${API_PREFIX}/listings`, data),
  getOne: (id) => api.get(`${API_PREFIX}/listings/${id}`),
  update: (id, data) => api.put(`${API_PREFIX}/listings/${id}`, data),
  delete: (id) => api.delete(`${API_PREFIX}/listings/${id}`),
  getMyListings: (limit = 20, skip = 0) =>
    api.get(`${API_PREFIX}/listings/my-listings`, { params: { limit, skip } }),
  search: (params) => api.get(`${API_PREFIX}/listings/search`, { params }),
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post(`${API_PREFIX}/reviews`, data),
  getForTarget: (targetType, targetId, limit = 20, skip = 0) =>
    api.get(`${API_PREFIX}/reviews/target/${targetType}/${targetId}`, { params: { limit, skip } }),
  getMyReviews: (limit = 20, skip = 0) =>
    api.get(`${API_PREFIX}/reviews/my-reviews`, { params: { limit, skip } }),
  delete: (reviewId) => api.delete(`${API_PREFIX}/reviews/${reviewId}`),
};
