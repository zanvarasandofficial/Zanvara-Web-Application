import { getApiUrl } from "./config";

const API_URL = getApiUrl();
const CUSTOMER_TOKEN_KEY = "zanvara_customer_token";
const CUSTOMER_USER_KEY = "zanvara_customer_user";

export function getCustomerToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function getCustomerUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CUSTOMER_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCustomerSession(accessToken, user) {
  localStorage.setItem(CUSTOMER_TOKEN_KEY, accessToken);
  localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
}

export function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_USER_KEY);
}

async function parseError(response) {
  const data = await response.json().catch(() => ({}));
  const message = Array.isArray(data.message)
    ? data.message.join(", ")
    : data.message;
  throw new Error(message ?? "Request failed");
}

async function apiPost(path, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Backend connect nahi ho raha. Zanvara Backend folder mein npm run dev chalao.",
    );
  }

  if (!response.ok) {
    await parseError(response);
  }

  return response.json();
}

export async function requestEmailOtp(email, name) {
  return apiPost("/auth/email/request-otp", { email, name: name || undefined });
}

export async function verifyEmailOtp(email, code, name) {
  const data = await apiPost("/auth/email/verify-otp", {
    email,
    code,
    name: name || undefined,
  });
  setCustomerSession(data.accessToken, data.user);
  return data;
}

export function getGoogleAuthUrl(redirectPath = "/checkout") {
  const apiBase = API_URL.replace(/\/api$/, "");
  return `${apiBase}/api/auth/google?redirect=${encodeURIComponent(redirectPath)}`;
}

export async function fetchCustomerProfile() {
  const token = getCustomerToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    clearCustomerSession();
    return null;
  }

  if (!response.ok) {
    throw new Error("Could not verify session.");
  }

  const user = await response.json();

  if (user.role === "ADMIN") {
    clearCustomerSession();
    return null;
  }

  setCustomerSession(token, user);
  return user;
}

export async function customerFetch(path, options = {}) {
  const token = getCustomerToken();
  const headers = new Headers(options.headers ?? {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearCustomerSession();
    throw new Error("Session expired. Please sign in again.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Request failed",
    );
  }

  return data;
}

export async function updateCustomerProfile(name) {
  const user = await customerFetch("/auth/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const token = getCustomerToken();
  if (token) {
    setCustomerSession(token, user);
  }

  return user;
}
