const CART_KEY = "zanvara-cart";
const ORDER_KEY = "zanvara-last-order";

export function readCartFromStorage() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCartToStorage(items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function saveLastOrder(order) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function readLastOrder() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
