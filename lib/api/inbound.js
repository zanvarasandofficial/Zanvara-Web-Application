import { getApiUrl } from "./config";

const API_URL = getApiUrl();

export async function submitContactMessage(payload) {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Could not send message.",
    );
  }

  return data;
}

export async function subscribeNewsletter(email) {
  const response = await fetch(`${API_URL}/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Could not subscribe.",
    );
  }

  return data;
}
