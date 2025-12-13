const API_BASE = import.meta.env.VITE_API_BASE || "https://iapss-backend.onrender.com/api";

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API failed: ${res.status}`);
  }

  return res.json();
}
