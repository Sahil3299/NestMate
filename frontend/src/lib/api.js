import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "nestmate_token";

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Listing APIs
export const listingAPI = {
  create: (data) => api.post("/api/listings", data),
  getOne: (id) => api.get(`/api/listings/${id}`),
  update: (id, data) => api.put(`/api/listings/${id}`, data),
  delete: (id) => api.delete(`/api/listings/${id}`),
  getMyListings: (limit = 20, skip = 0) =>
    api.get("/api/listings/my-listings", { params: { limit, skip } }),
  search: (params) => api.get("/api/listings/search", { params }),
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post("/api/reviews", data),
  getForTarget: (targetType, targetId, limit = 20, skip = 0) =>
    api.get("/api/reviews", { params: { targetType, targetId, limit, skip } }),
  getMyReviews: (limit = 20, skip = 0) =>
    api.get("/api/reviews/my-reviews", { params: { limit, skip } }),
  delete: (reviewId) => api.delete(`/api/reviews/${reviewId}`),
};


