import { absoluteUrl } from "./site";

export function resolvePublicAssetUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/api\/?$/, "");
  if (apiBase && trimmed.startsWith("/")) {
    return `${apiBase}${trimmed}`;
  }

  return absoluteUrl(trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
}
