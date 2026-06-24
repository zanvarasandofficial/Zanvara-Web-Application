import { getApiUrl } from "./config";

const API_URL = getApiUrl();

export async function fetchHeroSettings() {
  try {
    const response = await fetch(`${API_URL}/settings/hero`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}
