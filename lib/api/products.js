import { getApiUrl } from "./config";

const API_URL = getApiUrl();

export async function fetchLandingProducts() {
  try {
    const response = await fetch(`${API_URL}/products/landing`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { popular: [], latest: [], bestDeals: [] };
    }

    return response.json();
  } catch {
    return { popular: [], latest: [], bestDeals: [] };
  }
}

export async function fetchAllProducts() {
  try {
    const response = await fetch(`${API_URL}/products`, {
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

export async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
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
