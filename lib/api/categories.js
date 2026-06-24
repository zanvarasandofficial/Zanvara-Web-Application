import { getApiUrl } from "./config";

const API_URL = getApiUrl();

export async function fetchStorefrontCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}

export async function fetchCategoryNames() {
  try {
    const response = await fetch(`${API_URL}/categories/names`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}
