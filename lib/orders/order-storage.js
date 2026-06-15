const ORDERS_KEY = "zanvara-orders";

export const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

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

export function readOrderHistory() {
  return readJson(ORDERS_KEY, []);
}

export function saveOrderToHistory(order) {
  const orders = readOrderHistory();
  const entry = {
    ...order,
    status: order.status || ORDER_STATUS.PENDING,
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = orders.findIndex((item) => item.id === entry.id);
  if (existingIndex >= 0) {
    orders[existingIndex] = entry;
  } else {
    orders.unshift(entry);
  }

  writeJson(ORDERS_KEY, orders);
  return entry;
}

export function updateOrderStatus(orderId, status) {
  const orders = readOrderHistory();
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  writeJson(ORDERS_KEY, orders);
  return orders[index];
}

export function getOrderById(orderId) {
  return readOrderHistory().find((order) => order.id === orderId) ?? null;
}

export function formatOrderForAdmin(order) {
  const createdAt = order.createdAt ? new Date(order.createdAt) : null;

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
    status: order.status || ORDER_STATUS.PENDING,
    payment: order.paymentMethod || "Cash on Delivery",
    date: createdAt
      ? createdAt.toLocaleDateString("en-PK", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—",
    createdAt: order.createdAt,
    userId: order.userId ?? null,
    raw: order,
  };
}

