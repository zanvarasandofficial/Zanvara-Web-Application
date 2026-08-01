export const SITE_NAME = "Zanvara";

export const SITE_TAGLINE = "Premium kinetic sand tables & calm living";

export const DEFAULT_DESCRIPTION =
  "Shop premium kinetic sand tables and calm-living essentials at Zanvara. Cash on delivery across Pakistan, curated quality, and fast support.";

export const DEFAULT_KEYWORDS = [
  "Zanvara",
  "kinetic sand table",
  "sand table Pakistan",
  "sensory table",
  "premium furniture Pakistan",
  "COD Pakistan",
  "pre-order furniture",
];

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") {
    return base;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
