import {
  ORDER_STATUS,
  getOrderStatusLabel,
  normalizeOrderStatus,
} from "./order-status";

export { ORDER_STATUS };

const ORDERS_KEY = "zanvara-orders";

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeOrderRecord(order) {
  return {
    ...order,
    status: normalizeOrderStatus(order.status),
    updatedAt: order.updatedAt || order.createdAt || new Date().toISOString(),
  };
}

export function readOrderHistory() {
  return readJson(ORDERS_KEY, []).map(normalizeOrderRecord);
}

export function saveOrderToHistory(order) {
  const orders = readOrderHistory();
  const entry = normalizeOrderRecord({
    ...order,
    status: order.status || ORDER_STATUS.PENDING,
    updatedAt: new Date().toISOString(),
  });

  const existingIndex = orders.findIndex((item) => item.id === entry.id);
  if (existingIndex >= 0) {
    orders[existingIndex] = entry;
  } else {
    orders.unshift(entry);
  }

  writeJson(ORDERS_KEY, orders);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("zanvara-orders-changed"));
  }
  return entry;
}

export function updateOrderStatus(orderId, status) {
  const orders = readOrderHistory();
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) return null;

  orders[index] = normalizeOrderRecord({
    ...orders[index],
    status: normalizeOrderStatus(status),
    updatedAt: new Date().toISOString(),
  });

  writeJson(ORDERS_KEY, orders);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("zanvara-orders-changed"));
  }
  return orders[index];
}

export function getOrderById(orderId) {
  const order = readOrderHistory().find((item) => item.id === orderId);
  return order ?? null;
}

export function formatOrderForAdmin(order) {
  const createdAt = order.createdAt ? new Date(order.createdAt) : null;
  const status = normalizeOrderStatus(order.status);

  return {
    id: order.id,
    customer: order.customer?.fullName || "Guest",
    email: order.customer?.email || "—",
    phone: order.customer?.phone || "—",
    address: order.customer?.address || "—",
    city: order.customer?.city || "—",
    notes: order.customer?.notes || "",
    total: order.total ?? 0,
    subtotal: order.subtotal ?? 0,
    deliveryTotal: order.deliveryTotal ?? 0,
    items: order.items ?? [],
    itemCount: order.items?.length ?? 0,
    status,
    statusLabel: getOrderStatusLabel(status),
    payment: order.paymentMethod || "Cash on Delivery",
    date: createdAt
      ? createdAt.toLocaleDateString("en-PK", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—",
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    userId: order.userId ?? null,
    raw: order,
  };
}
