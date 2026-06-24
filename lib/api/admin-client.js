import {
  clearCustomerSession,
  setCustomerSession,
} from "./customer-auth";

import { getApiUrl } from "./config";

const API_URL = getApiUrl();

const ADMIN_TOKEN_KEY = "zanvara_admin_token";

const ADMIN_USER_KEY = "zanvara_admin_user";

const ADMIN_TOKEN_COOKIE = "zanvara_admin_token";

const ADMIN_USER_COOKIE = "zanvara_admin_user";

const COOKIE_MAX_AGE_DAYS = 7;



function setCookie(name, value, days = COOKIE_MAX_AGE_DAYS) {

  if (typeof document === "undefined") return;



  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;

}



function getCookie(name) {

  if (typeof document === "undefined") return null;



  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[$()*+.?[\\\]^{|}-]/g, "\\$&")}=([^;]*)`));

  return match ? decodeURIComponent(match[1]) : null;

}



function deleteCookie(name) {

  if (typeof document === "undefined") return;



  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;

}



async function parseApiError(response) {

  const data = await response.json().catch(() => ({}));

  return Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Request failed";
}

function applyAuthSession(data) {
  if (data.user?.role === "ADMIN") {
    clearCustomerSession();
    setAdminSession(data.accessToken, data.user);
    return { ...data, isAdmin: true };
  }

  clearAdminSession();
  setCustomerSession(data.accessToken, data.user);
  return { ...data, isAdmin: false };
}



export function getAdminToken() {

  if (typeof window === "undefined") return null;

  return getCookie(ADMIN_TOKEN_COOKIE) || localStorage.getItem(ADMIN_TOKEN_KEY);

}



export function getAdminUser() {

  if (typeof window === "undefined") return null;



  try {

    const raw = getCookie(ADMIN_USER_COOKIE) || localStorage.getItem(ADMIN_USER_KEY);

    return raw ? JSON.parse(raw) : null;

  } catch {

    return null;

  }

}



export function setAdminSession(accessToken, user) {

  setCookie(ADMIN_TOKEN_COOKIE, accessToken);

  setCookie(ADMIN_USER_COOKIE, JSON.stringify(user));

  localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);

  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));

}



export function clearAdminSession() {

  deleteCookie(ADMIN_TOKEN_COOKIE);

  deleteCookie(ADMIN_USER_COOKIE);

  localStorage.removeItem(ADMIN_TOKEN_KEY);

  localStorage.removeItem(ADMIN_USER_KEY);

}



export function redirectToAdminLogin() {

  if (typeof window === "undefined") return;

  if (window.location.pathname === "/dashboard/admin/login") return;

  window.location.href = "/dashboard/admin/login";

}



export async function adminLogin(email, password) {
  let response;

  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(
      "Backend connect nahi ho raha. Zanvara Backend folder mein npm run dev chalao.",
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return applyAuthSession(data);
}

export async function adminRequestOtp(email, name) {
  let response;



  try {

    response = await fetch(`${API_URL}/auth/email/request-otp`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        email,
        name: name || undefined,
        forSignup: true,
      }),

    });

  } catch {

    throw new Error(

      "Backend connect nahi ho raha. Zanvara Backend folder mein npm run dev chalao.",

    );

  }



  const data = await response.json().catch(() => ({}));



  if (!response.ok) {

    throw new Error(await parseApiError(response));

  }



  return data;

}



export async function adminVerifyOtp(email, code, name, password) {

  let response;



  try {

    response = await fetch(`${API_URL}/auth/email/verify-otp`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        email,
        code,
        name: name || undefined,
        password,
      }),

    });

  } catch {

    throw new Error(

      "Backend connect nahi ho raha. Zanvara Backend folder mein npm run dev chalao.",

    );

  }



  const data = await response.json().catch(() => ({}));



  if (!response.ok) {

    throw new Error(await parseApiError(response));

  }



  return applyAuthSession(data);

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



  if (

    options.body &&

    typeof options.body === "string" &&

    !headers.has("Content-Type")

  ) {

    headers.set("Content-Type", "application/json");

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



export async function uploadCategoryImage(categoryId, file) {

  const token = getAdminToken();



  if (!token) {

    throw new Error("Please sign in as admin first.");

  }



  const formData = new FormData();

  formData.append("file", file);



  const response = await fetch(`${API_URL}/admin/categories/${categoryId}/upload`, {

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


