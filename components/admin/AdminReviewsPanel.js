"use client";

import { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import AdminReviewFormModal from "./AdminReviewFormModal";
import {
  deleteReviewByAdmin,
  getAdminReviewRows,
  getReviewStats,
  REVIEWS_CHANGED_EVENT,
  updateReviewByAdmin,
} from "../../lib/reviews/review-storage";
import {
  adminCardClassName,
  adminInputClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
  adminSelectClassName,
} from "../../lib/ui/adminStyles";

function AdminStarRating({ rating }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className={[
            "h-4 w-4",
            index < rating ? "text-amber-500" : "text-slate-300",
          ].join(" ")}
          fill="currentColor"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export default function AdminReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    pending: 0,
    published: 0,
    rejected: 0,
  });
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editReview, setEditReview] = useState(null);

  function loadReviews() {
    setReviews(getAdminReviewRows());
    setStats(getReviewStats());
  }

  useEffect(() => {
    loadReviews();

    function handleReviewsChanged() {
      loadReviews();
    }

    window.addEventListener(REVIEWS_CHANGED_EVENT, handleReviewsChanged);
    return () => window.removeEventListener(REVIEWS_CHANGED_EVENT, handleReviewsChanged);
  }, []);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesStatus = statusFilter === "ALL" || review.status === statusFilter;
      const matchesSearch =
        !query ||
        review.customerName.toLowerCase().includes(query) ||
        review.productName.toLowerCase().includes(query) ||
        review.title.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [reviews, search, statusFilter]);

  function handleApprove(review) {
    updateReviewByAdmin(review.id, { status: "Published", verified: true });
    loadReviews();
  }

  function handleReject(review) {
    updateReviewByAdmin(review.id, { status: "Rejected" });
    loadReviews();
  }

  function handleDelete(review) {
    if (!window.confirm(`Delete review by ${review.customerName}?`)) return;
    deleteReviewByAdmin(review.id);
    loadReviews();
    if (editReview?.id === review.id) {
      setEditReview(null);
    }
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Average rating",
            value: stats.average.toFixed(1),
            note: "Store-wide score",
          },
          { label: "Total reviews", value: String(stats.total), note: "All submissions" },
          { label: "Published", value: String(stats.published), note: "Live on storefront" },
          { label: "Pending", value: String(stats.pending), note: "Awaiting moderation" },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50"
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              {item.value}
            </p>
            <p className="mt-2 text-xs text-slate-400">{item.note}</p>
          </article>
        ))}
      </div>

      <section className={`${adminCardClassName} mt-8 overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">All reviews</h2>
            <p className="text-sm text-slate-500">
              {reviews.length} customer reviews · showing {filteredReviews.length}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className={adminPrimaryButtonClassName}
            >
              Add review
            </button>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={adminSelectClassName}
            >
              <option value="ALL">All statuses</option>
              <option value="Published">Published</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reviews..."
              className={adminInputClassName}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredReviews.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No reviews yet. Use <span className="font-medium text-slate-700">Add review</span>{" "}
              to create one.
            </div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">Rating</th>
                  <th className="px-6 py-3 font-semibold">Review</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="border-t border-slate-100 align-top">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{review.customerName}</p>
                      <p className="text-xs text-slate-500">{review.customerCity || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{review.productName}</td>
                    <td className="px-6 py-4">
                      <AdminStarRating rating={review.rating} />
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <p className="font-medium text-slate-900">{review.title}</p>
                      <p className="mt-1 line-clamp-2 text-slate-500">{review.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{review.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={review.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {review.status !== "Published" ? (
                          <button
                            type="button"
                            onClick={() => handleApprove(review)}
                            className={adminPrimaryButtonClassName}
                          >
                            Approve
                          </button>
                        ) : null}
                        {review.status !== "Rejected" ? (
                          <button
                            type="button"
                            onClick={() => handleReject(review)}
                            className="rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                          >
                            Reject
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setEditReview(review)}
                          className={adminSecondaryButtonClassName}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review)}
                          className="rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <AdminReviewFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSaved={loadReviews}
      />

      <AdminReviewFormModal
        open={Boolean(editReview)}
        mode="edit"
        review={editReview}
        onClose={() => setEditReview(null)}
        onSaved={loadReviews}
      />
    </>
  );
}
