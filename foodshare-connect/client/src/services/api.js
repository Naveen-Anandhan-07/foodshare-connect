import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT token (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Donor APIs ----------
export const registerDonor = (data) => api.post("/donors/register", data);
export const loginDonor = (data) => api.post("/donors/login", data);
export const getDonorProfile = () => api.get("/donors/profile");
export const updateDonorProfile = (data) => api.put("/donors/profile", data);
export const deleteDonorProfile = () => api.delete("/donors/profile");

// ---------- Receiver APIs ----------
export const registerReceiver = (data) => api.post("/receivers/register", data);
export const loginReceiver = (data) => api.post("/receivers/login", data);
export const getReceiverProfile = () => api.get("/receivers/profile");
export const updateReceiverProfile = (data) => api.put("/receivers/profile", data);
export const deleteReceiverProfile = () => api.delete("/receivers/profile");

// ---------- Food Donation APIs ----------
export const createDonation = (data) => api.post("/donations", data);
export const getAllDonations = (params) => api.get("/donations", { params });
export const getAvailableDonations = (params) =>
  api.get("/donations/available", { params });
export const getMyDonations = () => api.get("/donations/my-donations");
export const getDonationById = (id) => api.get(`/donations/${id}`);
export const updateDonation = (id, data) => api.put(`/donations/${id}`, data);
export const deleteDonation = (id) => api.delete(`/donations/${id}`);

// ---------- Food Request APIs ----------
export const createRequest = (data) => api.post("/requests", data);
export const getMyRequests = () => api.get("/requests/my-requests");
export const getDonorRequests = () => api.get("/requests/donor-requests");
export const acceptRequest = (id) => api.put(`/requests/${id}/accept`);
export const rejectRequest = (id) => api.put(`/requests/${id}/reject`);
export const completeRequest = (id) => api.put(`/requests/${id}/complete`);
export const cancelRequest = (id) => api.put(`/requests/${id}/cancel`);

export default api;
