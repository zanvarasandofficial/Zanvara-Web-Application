"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import AdminReviewFormModal from "./AdminReviewFormModal";
import {
  getAdminReviewRows,
  REVIEWS_CHANGED_EVENT,
} from "../../lib/reviews/review-storage";
import {
  adminCardClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "../../lib/ui/adminStyles";

export default function AdminDashboardReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [addOpen, setAddOpen] = useState(false);

  async function loadReviews() {
    try {
      const rows = await getAdminReviewRows();
      setReviews(Array.isArray(rows) ? rows.slice(0, 5) : []);
    } catch {
      setReviews([]);
    }
  }

  useEffect(() => {
    loadReviews();
    window.addEventListener(REVIEWS_CHANGED_EVENT, loadReviews);
    return () => window.removeEventListener(REVIEWS_CHANGED_EVENT, loadReviews);
  }, []);

  return (
    <>
      <section className={`${adminCardClassName} mt-6 overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent reviews</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className={adminPrimaryButtonClassName}
            >
              Add review
            </button>
            <Link
              href="/dashboard/admin/reviews"
              className={adminSecondaryButtonClassName}
            >
              View all
            </Link>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            No customer reviews yet. Add one to show it on the storefront.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">Rating</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-t border-slate-100">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {review.customerName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{review.productName}</td>
                    <td className="px-6 py-4 text-amber-500">
                      {"★".repeat(review.rating)}
                      <span className="sr-only">{review.rating} stars</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={review.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AdminReviewFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSaved={loadReviews}
      />
    </>
  );
}
