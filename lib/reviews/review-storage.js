import { readOrderHistory } from "../orders/order-storage";
import {
  getOrderStatusLabel,
  isOrderDelivered,
  isOrderCancelled,
} from "../orders/order-status";

const USER_REVIEWS_KEY = "zanvara-user-reviews";
const ADMIN_STATE_KEY = "zanvara-review-admin";
export const REVIEWS_CHANGED_EVENT = "zanvara-reviews-changed";

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

function readAdminState() {
  return readJson(ADMIN_STATE_KEY, { deletedIds: [], updates: {} });
}

function writeAdminState(state) {
  writeJson(ADMIN_STATE_KEY, state);
}

export function readUserSubmittedReviews() {
  return readJson(USER_REVIEWS_KEY, []);
}

function writeUserSubmittedReviews(reviews) {
  writeJson(USER_REVIEWS_KEY, reviews);
}

function formatReviewDate(value) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toISOString().slice(0, 10);
}

function normalizeReview(review) {
  return {
    ...review,
    date: formatReviewDate(review.date || review.createdAt),
    status: review.status || "Pending",
    verified: Boolean(review.verified),
  };
}

export function notifyReviewsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(REVIEWS_CHANGED_EVENT));
}

export function readAllReviews() {
  if (typeof window === "undefined") {
    return [];
  }

  const userReviews = readUserSubmittedReviews().map(normalizeReview);
  const admin = readAdminState();

  return userReviews
    .filter((review) => !admin.deletedIds.includes(review.id))
    .map((review) =>
      admin.updates[review.id]
        ? normalizeReview({ ...review, ...admin.updates[review.id] })
        : review,
    );
}

export function getPublishedReviews(limit) {
  const published = readAllReviews().filter(
    (review) => review.status === "Published" && review.verified,
  );

  return typeof limit === "number" ? published.slice(0, limit) : published;
}

export function getReviewsByProductId(productId) {
  return readAllReviews().filter(
    (review) =>
      review.productId === productId &&
      review.status === "Published" &&
      review.verified,
  );
}

export function getAdminReviewRows() {
  return readAllReviews();
}

export function getReviewStats() {
  const reviews = readAllReviews();
  const pending = reviews.filter((review) => review.status === "Pending").length;
  const published = reviews.filter((review) => review.status === "Published").length;
  const rejected = reviews.filter((review) => review.status === "Rejected").length;
  const rated = reviews.filter((review) => review.rating > 0);
  const average =
    rated.length > 0
      ? rated.reduce((total, review) => total + review.rating, 0) / rated.length
      : 0;

  return {
    average,
    total: reviews.length,
    pending,
    published,
    rejected,
  };
}

export function saveUserReview(payload) {
  const review = normalizeReview({
    id: `user-rev-${Date.now()}`,
    ...payload,
    source: "customer",
    createdAt: new Date().toISOString(),
    date: new Date().toISOString().slice(0, 10),
    status: "Pending",
    verified: true,
  });

  writeUserSubmittedReviews([review, ...readUserSubmittedReviews()]);
  notifyReviewsChanged();
  return review;
}

export function saveAdminReview(payload) {
  const review = normalizeReview({
    id: `admin-rev-${Date.now()}`,
    ...payload,
    source: "admin",
    createdAt: new Date().toISOString(),
    date: new Date().toISOString().slice(0, 10),
    status: payload.status || "Published",
    verified: payload.verified ?? true,
  });

  writeUserSubmittedReviews([review, ...readUserSubmittedReviews()]);
  notifyReviewsChanged();
  return review;
}

export function updateReviewByAdmin(id, patch) {
  const userReviews = readUserSubmittedReviews();
  const userIndex = userReviews.findIndex((review) => review.id === id);

  if (userIndex >= 0) {
    userReviews[userIndex] = { ...userReviews[userIndex], ...patch };
    writeUserSubmittedReviews(userReviews);
  } else {
    const admin = readAdminState();
    admin.updates[id] = { ...(admin.updates[id] || {}), ...patch };
    writeAdminState(admin);
  }

  notifyReviewsChanged();
}

export function deleteReviewByAdmin(id) {
  const userReviews = readUserSubmittedReviews();
  const nextUserReviews = userReviews.filter((review) => review.id !== id);

  if (nextUserReviews.length !== userReviews.length) {
    writeUserSubmittedReviews(nextUserReviews);
  } else {
    const admin = readAdminState();
    if (!admin.deletedIds.includes(id)) {
      admin.deletedIds.push(id);
    }
    delete admin.updates[id];
    writeAdminState(admin);
  }

  notifyReviewsChanged();
}

export function getReviewEligibility(productId) {
  const userReviews = readUserSubmittedReviews();

  if (userReviews.some((review) => review.productId === productId)) {
    return {
      canReview: false,
      state: "already_reviewed",
      message:
        "Aap is product ka review pehle hi submit kar chuke hain. Admin approve karne ke baad yahan show hoga.",
    };
  }

  const orders = readOrderHistory();
  const deliveredOrder = orders.find(
    (order) =>
      isOrderDelivered(order.status) &&
      order.items?.some((item) => item.productId === productId),
  );

  if (deliveredOrder) {
    return {
      canReview: true,
      state: "eligible",
      orderId: deliveredOrder.id,
      message: "Aap ka parcel deliver ho chuka hai. Ab review submit kar sakte hain.",
    };
  }

  const activeOrder = orders.find(
    (order) =>
      !isOrderDelivered(order.status) &&
      !isOrderCancelled(order.status) &&
      order.items?.some((item) => item.productId === productId),
  );

  if (activeOrder) {
    return {
      canReview: false,
      state: "pending",
      orderStatus: activeOrder.status,
      orderId: activeOrder.id,
      message: `Review tab available hogi jab order "${getOrderStatusLabel(activeOrder.status)}" ho jaye.`,
    };
  }

  return {
    canReview: false,
    state: "no_purchase",
    message:
      "Review sirf un customers de sakte hain jinka is product ka order deliver ho chuka ho.",
  };
}
