const API_BASE = "https://iapss-backend.onrender.com/api";

export async function uploadProblemImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/problems/upload-image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Upload failed with status ${res.status}`);
  }

  return res.json(); // { url, originalName, mimeType, size }
}

export async function uploadCodeFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:4000/api/code/upload-code", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload code");

  return res.json();
}
