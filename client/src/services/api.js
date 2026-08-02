import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

export const SERVER_BASE_URL =
  API_BASE_URL.replace(/\/api\/?$/, "");

function getConfig() {
  const token =
    localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization:
        "Bearer " + token,
    },
  };
}

function getMultipartConfig() {
  const config = getConfig();

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      "Content-Type": "multipart/form-data",
    },
  };
}

export function registerDonor(data) {
  return axios.post(
    API_BASE_URL + "/donors/register",
    data
  );
}

export function loginDonor(data) {
  return axios.post(
    API_BASE_URL + "/donors/login",
    data
  );
}

export function getDonorProfile() {
  return axios.get(
    API_BASE_URL + "/donors/profile",
    getConfig()
  );
}

export function updateDonorProfile(
  data
) {
  return axios.put(
    API_BASE_URL + "/donors/profile",
    data,
    getConfig()
  );
}

export function deleteDonorProfile() {
  return axios.delete(
    API_BASE_URL + "/donors/profile",
    getConfig()
  );
}

export function registerReceiver(
  data
) {
  return axios.post(
    API_BASE_URL +
      "/receivers/register",
    data
  );
}

export function loginReceiver(data) {
  return axios.post(
    API_BASE_URL +
      "/receivers/login",
    data
  );
}

export function getReceiverProfile() {
  return axios.get(
    API_BASE_URL +
      "/receivers/profile",
    getConfig()
  );
}

export function updateReceiverProfile(
  data
) {
  return axios.put(
    API_BASE_URL +
      "/receivers/profile",
    data,
    getConfig()
  );
}

export function deleteReceiverProfile() {
  return axios.delete(
    API_BASE_URL +
      "/receivers/profile",
    getConfig()
  );
}

export function createDonation(data) {
  return axios.post(
    API_BASE_URL + "/donations",
    data,
    getMultipartConfig()
  );
}

export function getAllDonations(
  params
) {
  return axios.get(
    API_BASE_URL + "/donations",
    {
      params: params,
    }
  );
}

export function getAvailableDonations(
  params
) {
  return axios.get(
    API_BASE_URL +
      "/donations/available",
    {
      params: params,
    }
  );
}

export function getMyDonations() {
  return axios.get(
    API_BASE_URL +
      "/donations/my-donations",
    getConfig()
  );
}

export function getDonationById(id) {
  return axios.get(
    API_BASE_URL +
      "/donations/" +
      id
  );
}

export function updateDonation(
  id,
  data
) {
  return axios.put(
    API_BASE_URL +
      "/donations/" +
      id,
    data,
    data instanceof FormData
      ? getMultipartConfig()
      : getConfig()
  );
}

export function deleteDonation(id) {
  return axios.delete(
    API_BASE_URL +
      "/donations/" +
      id,
    getConfig()
  );
}

export function createRequest(data) {
  return axios.post(
    API_BASE_URL + "/requests",
    data,
    getConfig()
  );
}

export function getMyRequests() {
  return axios.get(
    API_BASE_URL +
      "/requests/my-requests",
    getConfig()
  );
}

export function getDonorRequests() {
  return axios.get(
    API_BASE_URL +
      "/requests/donor-requests",
    getConfig()
  );
}

export function acceptRequest(id) {
  return axios.put(
    API_BASE_URL +
      "/requests/" +
      id +
      "/accept",
    {},
    getConfig()
  );
}

export function rejectRequest(id) {
  return axios.put(
    API_BASE_URL +
      "/requests/" +
      id +
      "/reject",
    {},
    getConfig()
  );
}

export function completeRequest(
  id,
  otp
) {
  return axios.put(
    API_BASE_URL +
      "/requests/" +
      id +
      "/complete",
    {
      otp: otp,
    },
    getConfig()
  );
}

export function cancelRequest(id) {
  return axios.put(
    API_BASE_URL +
      "/requests/" +
      id +
      "/cancel",
    {},
    getConfig()
  );
}

export function loginAdmin(data) {
  return axios.post(
    API_BASE_URL + "/admin/login",
    data
  );
}

export function getAdminDonors(
  status
) {
  const config = getConfig();

  config.params = {
    status: status,
  };

  return axios.get(
    API_BASE_URL +
      "/admin/donors",
    config
  );
}

export function updateDonorFssaiStatus(
  id,
  data
) {
  return axios.put(
    API_BASE_URL +
      "/admin/donors/" +
      id +
      "/fssai-status",
    data,
    getConfig()
  );
}
export function createDonorReview(
  requestId,
  data
) {
  return axios.post(
    API_BASE_URL +
      "/reviews/donor/" +
      requestId,
    data,
    getConfig()
  );
}

export function createReceiverReview(
  requestId,
  data
) {
  return axios.post(
    API_BASE_URL +
      "/reviews/receiver/" +
      requestId,
    data,
    getConfig()
  );
}

export function getFlaggedReviews() {
  return axios.get(
    API_BASE_URL +
      "/reviews/flagged",
    getConfig()
  );
}

export function updateReceiverLocation(
  id,
  location
) {
  return axios.put(
    API_BASE_URL +
      "/requests/" +
      id +
      "/location",
    location,
    getConfig()
  );
}

export function stopLocationSharing(id) {
  return axios.put(
    API_BASE_URL +
      "/requests/" +
      id +
      "/stop-location",
    {},
    getConfig()
  );
}
