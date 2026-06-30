import {
  createAdminReview,
  deleteAdminReview,
  fetchAdminReviewStats,
  fetchAdminReviews,
  fetchMyReviewedProductIds as fetchReviewedProductIdsApi,
  fetchOrderItemReviewStatus as fetchOrderItemReviewStatusApi,
  fetchProductReviews,
  fetchPublishedReviews,
  fetchReviewEligibility,
  fetchReviewSummary,
  submitReview,
  updateAdminReview,
} from "../api/reviews";

export const REVIEWS_CHANGED_EVENT = "zanvara-reviews-changed";

export function notifyReviewsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(REVIEWS_CHANGED_EVENT));
}

export async function getPublishedReviews(limit) {
  return fetchPublishedReviews(limit);
}

export async function getReviewSummary() {
  return fetchReviewSummary();
}

export async function getReviewsByProductId(productId) {
  return fetchProductReviews(productId);
}

export async function getAdminReviewRows() {
  return fetchAdminReviews();
}

export async function getReviewStats() {
  return fetchAdminReviewStats();
}

export async function saveUserReview(payload) {
  const review = await submitReview(payload);
  notifyReviewsChanged();
  return review;
}

export async function saveAdminReview(payload) {
  const review = await createAdminReview(payload);
  notifyReviewsChanged();
  return review;
}

export async function updateReviewByAdmin(id, patch) {
  const review = await updateAdminReview(id, patch);
  notifyReviewsChanged();
  return review;
}

export async function deleteReviewByAdmin(id) {
  await deleteAdminReview(id);
  notifyReviewsChanged();
}

export async function fetchMyReviewedProductIds() {
  return fetchReviewedProductIdsApi();
}

export function normalizeProductId(id) {
  return String(id ?? "").trim();
}

export function orderItemReviewKey(orderNumber, productId) {
  return `${String(orderNumber ?? "").trim()}:${normalizeProductId(productId)}`;
}

export async function fetchOrderItemReviewStatus(items) {
  const normalizedItems = (Array.isArray(items) ? items : [])
    .map((item) => ({
      orderNumber: String(item.orderNumber ?? "").trim(),
      productId: normalizeProductId(item.productId),
    }))
    .filter((item) => item.orderNumber && item.productId);

  if (normalizedItems.length === 0) {
    return {};
  }

  return fetchOrderItemReviewStatusApi(normalizedItems);
}

export function isOrderItemReviewed(orderNumber, productId, reviewStatusMap = {}) {
  return Boolean(reviewStatusMap[orderItemReviewKey(orderNumber, productId)]?.reviewed);
}

export async function fetchReviewEligibilityForOrder(productId, orderNumber) {
  return fetchReviewEligibility(productId, orderNumber);
}

export { fetchReviewEligibility };
