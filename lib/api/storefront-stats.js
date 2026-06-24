import { getApiUrl } from "./config";

const API_URL = getApiUrl();

export async function fetchStorefrontStats() {
  const response = await fetch(`${API_URL}/public/storefront-stats`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load storefront stats.");
  }

  return response.json();
}

export function formatHeroCount(value) {
  const count = Number(value) || 0;

  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  }

  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
  }

  return count > 0 ? `${count}+` : "0";
}

export function formatHeroRating(value) {
  const rating = Number(value) || 0;
  if (rating <= 0) return "—";
  return rating.toFixed(1);
}
