import { getApiUrl } from "./config";
import { customerFetch } from "./customer-auth";
import { adminFetch } from "./admin-client";

const API_URL = getApiUrl();

async function publicFetch(path) {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Request failed",
    );
  }

  return data;
}

export async function fetchPublishedReviews(limit) {
  const query = typeof limit === "number" ? `?limit=${limit}` : "";
  return publicFetch(`/reviews${query}`);
}

export async function fetchReviewSummary() {
  return publicFetch("/reviews/summary");
}

export async function fetchProductReviews(productId) {
  return publicFetch(`/reviews/product/${productId}`);
}

export async function fetchReviewEligibility(productId, orderNumber) {
  const query = orderNumber
    ? `?orderNumber=${encodeURIComponent(orderNumber)}`
    : "";
  return customerFetch(`/reviews/eligibility/${productId}${query}`);
}

export async function fetchMyReviewedProductIds() {
  return customerFetch("/reviews/me/reviewed-products");
}

export async function fetchOrderItemReviewStatus(items) {
  return customerFetch("/reviews/me/order-item-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
}

export async function submitReview(payload) {
  return customerFetch("/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: payload.productId,
      customerCity: payload.customerCity,
      rating: payload.rating,
      title: payload.title,
      comment: payload.comment,
      orderNumber: payload.orderNumber ?? undefined,
      orderId: payload.orderId ?? undefined,
    }),
  });
}

export async function fetchAdminReviews() {
  return adminFetch("/admin/reviews");
}

export async function fetchAdminReviewStats() {
  return adminFetch("/admin/reviews/stats");
}

export async function createAdminReview(payload) {
  return adminFetch("/admin/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateAdminReview(id, payload) {
  return adminFetch(`/admin/reviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminReview(id) {
  return adminFetch(`/admin/reviews/${id}`, {
    method: "DELETE",
  });
}
