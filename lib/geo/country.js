import { CURRENCY } from "../money/constants";

export const GEO_HINT_COOKIE = "zanvara_geo_hint";
export const GEO_SOURCE_COOKIE = "zanvara_geo_source";

const INVALID_COUNTRY = new Set(["", "XX", "T1", "UNKNOWN"]);

export function normalizeCountryCode(value) {
  if (!value) {
    return null;
  }
  const code = String(value).trim().toUpperCase();
  if (INVALID_COUNTRY.has(code)) {
    return null;
  }
  return code.length === 2 ? code : null;
}

export function resolveCountryFromHeaders(headers) {
  const candidates = [
    headers.get("x-vercel-ip-country"),
    headers.get("cf-ipcountry"),
    headers.get("cloudfront-viewer-country"),
    headers.get("x-country-code"),
  ];

  for (const candidate of candidates) {
    const normalized = normalizeCountryCode(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

export function getClientIpFromHeaders(headers) {
  const direct = headers.get("cf-connecting-ip") || headers.get("x-real-ip");
  if (direct?.trim()) {
    return direct.trim();
  }

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return null;
}

export function isPrivateOrLocalIp(ip) {
  if (!ip) {
    return true;
  }

  const value = ip.toLowerCase();
  if (value === "127.0.0.1" || value === "::1" || value === "localhost") {
    return true;
  }

  if (value.startsWith("10.") || value.startsWith("192.168.")) {
    return true;
  }

  if (value.startsWith("172.")) {
    const second = Number(value.split(".")[1]);
    if (second >= 16 && second <= 31) {
      return true;
    }
  }

  return false;
}

export async function lookupCountryByIp(ip) {
  if (isPrivateOrLocalIp(ip)) {
    return null;
  }

  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country/`, {
      headers: { "User-Agent": "Zanvara-Storefront/1.0" },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const text = (await response.text()).trim();
    return normalizeCountryCode(text);
  } catch {
    return null;
  }
}

export function resolveCountryFromEnv() {
  return normalizeCountryCode(process.env.DEFAULT_COUNTRY_CODE);
}

export function currencyForCountry(countryCode) {
  return countryCode === "PK" ? CURRENCY.PKR : CURRENCY.USD;
}

export function applyGeoCookies(response, { country, currency, source }) {
  const maxAge = 60 * 60 * 24 * 365;

  response.cookies.set("zanvara_country", country, {
    path: "/",
    maxAge,
    sameSite: "lax",
  });
  response.cookies.set("zanvara_currency", currency, {
    path: "/",
    maxAge,
    sameSite: "lax",
  });
  response.cookies.set(GEO_SOURCE_COOKIE, source, {
    path: "/",
    maxAge,
    sameSite: "lax",
  });
  response.cookies.set(GEO_HINT_COOKIE, "0", {
    path: "/",
    maxAge,
    sameSite: "lax",
  });

  return response;
}
