const API_BASE = "https://iapss-backend.onrender.com/api";

async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export function analyseProblemApi(text) {
  return postJson("/problems/analyse", { text });
}

export function analyseCodeApi(code, language) {
  return postJson("/code/analyse", { code, language });
}
