"use client";

import { useEffect, useState } from "react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import {
  fetchReviewEligibility,
  getReviewsByProductId,
  REVIEWS_CHANGED_EVENT,
} from "../../lib/reviews/review-storage";
import Reveal from "../ui/Reveal";
import StarRating from "../ui/StarRating";
import ReviewSubmitModal from "../reviews/ReviewSubmitModal";

export default function ProductReviews({ productId, productName }) {
  const { user } = useCustomerAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [eligibility, setEligibility] = useState(null);

  async function loadReviews() {
    setReviews(getReviewsByProductId(productId));
    const nextEligibility = await fetchReviewEligibility(
      productId,
      user?.id,
      user?.email,
    );
    setEligibility(nextEligibility);
  }

  useEffect(() => {
    loadReviews();

    function handleReviewsChanged() {
      loadReviews();
    }

    window.addEventListener(REVIEWS_CHANGED_EVENT, handleReviewsChanged);
    return () => window.removeEventListener(REVIEWS_CHANGED_EVENT, handleReviewsChanged);
  }, [productId, user?.id, user?.email]);

  const average =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : 0;

  return (
    <>
      <section className="mt-16 border-t border-white/[0.06] pt-12">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
                Reviews
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Customer feedback
              </h2>
              {reviews.length > 0 ? (
                <div className="mt-3 flex items-center gap-3">
                  <StarRating rating={average} showValue />
                  <span className="text-sm text-zinc-500">
                    {reviews.length} verified review{reviews.length === 1 ? "" : "s"}
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">
                  Verified reviews appear here after delivery is complete.
                </p>
              )}
            </div>

            {eligibility?.state === "already_reviewed" ? (
              <p className="inline-flex w-fit items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-300">
                Review submitted
              </p>
            ) : eligibility?.canReview ? (
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="inline-flex w-fit cursor-pointer items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-500/15"
              >
                Add review
              </button>
            ) : null}
          </div>
        </Reveal>

        {eligibility && !eligibility.canReview && eligibility.state === "pending" ? (
          <Reveal delay={40}>
            <p className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
              {eligibility.message}
            </p>
          </Reveal>
        ) : null}

        <div className="mt-8 space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 40}>
                <article className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-zinc-500">{review.date}</span>
                  </div>
                  <h3 className="mt-3 font-semibold text-white">{review.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{review.comment}</p>
                  <p className="mt-4 text-sm font-medium text-zinc-300">
                    {review.customerName}
                    {review.customerCity ? (
                      <span className="ml-2 text-xs font-normal text-zinc-500">
                        · {review.customerCity}
                      </span>
                    ) : null}
                    <span className="ml-2 text-xs font-normal text-emerald-300">
                      Verified delivery
                    </span>
                  </p>
                </article>
              </Reveal>
            ))
          ) : (
            <Reveal delay={40}>
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center text-sm text-zinc-500">
                Published reviews for {productName} will show here.
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <ReviewSubmitModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productId={productId}
        productName={productName}
        onSubmitted={loadReviews}
      />
    </>
  );
}
