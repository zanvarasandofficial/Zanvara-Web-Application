import { adminFetch, getAdminToken } from "../api/admin-client";
import { normalizeOrderStatus } from "../orders/order-status";

export const ADMIN_BADGES_CHANGED_EVENT = "zanvara-admin-badges-changed";

const STORAGE_KEYS = {
  orders: "zanvara_admin_seen_orders_at",
  reviews: "zanvara_admin_seen_reviews_at",
  messages: "zanvara_admin_seen_messages_at",
};

export function getSeenAt(section) {
  if (typeof window === "undefined") return 0;

  const raw = localStorage.getItem(STORAGE_KEYS[section]);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function markSectionSeen(section) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEYS[section], String(Date.now()));
  window.dispatchEvent(new CustomEvent(ADMIN_BADGES_CHANGED_EVENT));
}

function itemCreatedAt(value) {
  const time = new Date(value ?? 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

export function countUnseenOrders(orders, seenAt) {
  return (Array.isArray(orders) ? orders : []).filter((order) => {
    if (normalizeOrderStatus(order.status) !== "pending") {
      return false;
    }

    return itemCreatedAt(order.createdAt) > seenAt;
  }).length;
}

export function countUnseenReviews(reviews, seenAt) {
  return (Array.isArray(reviews) ? reviews : []).filter((review) => {
    if (review.source !== "customer") {
      return false;
    }

    return itemCreatedAt(review.createdAt || review.date) > seenAt;
  }).length;
}

export function countUnseenMessages(messages, seenAt) {
  return (Array.isArray(messages) ? messages : []).filter((message) => {
    if (message.status !== "NEW") {
      return false;
    }

    return itemCreatedAt(message.createdAt) > seenAt;
  }).length;
}

export async function fetchSidebarBadgeCounts() {
  if (!getAdminToken()) {
    return { orders: 0, reviews: 0, messages: 0 };
  }

  const [orders, reviews, messages] = await Promise.all([
    adminFetch("/admin/orders").catch(() => []),
    adminFetch("/admin/reviews").catch(() => []),
    adminFetch("/admin/inbound").catch(() => []),
  ]);

  return {
    orders: countUnseenOrders(orders, getSeenAt("orders")),
    reviews: countUnseenReviews(reviews, getSeenAt("reviews")),
    messages: countUnseenMessages(messages, getSeenAt("messages")),
  };
}

export function badgeCountForSection(section, badges) {
  return badges?.[section] ?? 0;
}
