export async function apiRequest(endpoint, options = {}) {
  const res = await fetch(import.meta.env.VITE_API_BASE + endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", res.status, text);
    throw new Error(text || "API failed");
  }

  return res.json();
}
