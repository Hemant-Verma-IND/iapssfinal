// client/src/api/apiClient.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://iapss-backend.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Example: GET /landing/summary
export async function fetchLandingSummary(countryCode = "IN") {
  const res = await api.get("/landing/summary", {
    params: { country: countryCode },
  });
  return res.data;
}

// Example: GET /recommendations/next (requires auth, later)
export async function fetchNextRecommendation(token) {
  const res = await api.get("/recommendations/next", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}
