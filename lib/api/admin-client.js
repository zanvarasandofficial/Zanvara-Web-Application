const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const ADMIN_TOKEN_KEY = "zanvara_admin_token";
const ADMIN_USER_KEY = "zanvara_admin_user";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(accessToken, user) {
  localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function redirectToAdminLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/dashboard/admin/login") return;
  window.location.href = "/dashboard/admin/login";
}

export async function adminLogin(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? "Login failed");
  }

  if (data.user?.role !== "ADMIN") {
    throw new Error("Admin access only.");
  }

  setAdminSession(data.accessToken, data.user);
  return data;
}

export async function fetchAdminProfile() {
  const token = getAdminToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    clearAdminSession();
    return null;
  }

  if (!response.ok) {
    throw new Error("Could not verify admin session.");
  }

  const user = await response.json();

  if (user.role !== "ADMIN") {
    clearAdminSession();
    return null;
  }

  setAdminSession(token, user);
  return user;
}

export async function adminFetch(path, options = {}) {
  const token = getAdminToken();
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
    clearAdminSession();
    redirectToAdminLogin();
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

export async function uploadProductImage(file) {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Please sign in as admin first.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/admin/products/upload-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (response.status === 401) {
    clearAdminSession();
    redirectToAdminLogin();
    throw new Error("Session expired. Please sign in again.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Image upload failed",
    );
  }

  return data;
}

export async function uploadHeroMedia(file) {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Please sign in as admin first.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/admin/hero/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (response.status === 401) {
    clearAdminSession();
    redirectToAdminLogin();
    throw new Error("Session expired. Please sign in again.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Upload failed",
    );
  }

  return data;
}
