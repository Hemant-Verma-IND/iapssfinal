import { getToken } from "../utils/auth";

const API = "http://localhost:4000/api/code";

export async function saveCodeHistory(data) {
  const res = await fetch(API + "/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getToken(),   // <<< VERY IMPORTANT
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error("Failed to save history: " + msg);
  }

  return res.json();
}
