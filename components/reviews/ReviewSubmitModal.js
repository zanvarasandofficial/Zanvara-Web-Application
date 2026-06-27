"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useToast } from "../../context/ToastContext";
import { getGoogleAuthUrl } from "../../lib/api/customer-auth";
import {
  fetchReviewEligibility,
  saveUserReview,
} from "../../lib/reviews/review-storage";
import { inputClassName, labelClassName } from "../../lib/ui/formStyles";
import CheckoutAuthModal from "../auth/CheckoutAuthModal";
import StarRatingInput from "./StarRatingInput";

function lockBodyScroll() {
  const scrollY = window.scrollY;
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  return scrollY;
}

function unlockBodyScroll(scrollY) {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
}

export default function ReviewSubmitModal({
  open,
  onClose,
  productId,
  productName,
  onSubmitted,
}) {
  const { user, isAuthenticated, isLoading } = useCustomerAuth();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  const profileName = user?.name?.trim() || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setRating(5);
      setTitle("");
      setComment("");
      setCustomerCity("");
      setIsSubmitting(false);
      setAuthOpen(false);
      setEligibility(null);
      setEligibilityLoading(false);
    }
  }, [open, productId]);

  useEffect(() => {
    if (!open || !productId || !isAuthenticated || isLoading) {
      setEligibility(null);
      setEligibilityLoading(false);
      return;
    }

    let active = true;
    setEligibilityLoading(true);

    fetchReviewEligibility(productId, user?.id, user?.email)
      .then((result) => {
        if (active) setEligibility(result);
      })
      .finally(() => {
        if (active) setEligibilityLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, productId, isAuthenticated, isLoading, user?.id, user?.email]);

  useEffect(() => {
    if (!open) return;

    const scrollY = lockBodyScroll();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll(scrollY);
    };
  }, [open, onClose]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!eligibility?.canReview) {
      showToast(eligibility?.message || "Review submit nahi ho sakti.", "error");
      return;
    }

    if (!profileName) {
      showToast("Pehle apna profile name set karein.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      saveUserReview({
        productId,
        productName,
        customerName: profileName,
        customerCity: customerCity.trim(),
        userId: user?.id ?? null,
        userEmail: user?.email ?? null,
        orderId: eligibility.orderId ?? null,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      showToast("Review submit ho gayi aur ab live hai.", "success");
      onSubmitted?.();
      onClose();
    } catch (error) {
      showToast(error.message || "Review save nahi ho saki.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 pt-[max(1rem,8vh)] sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-submit-title"
      >
        <button
          type="button"
          aria-label="Close review dialog"
          className="fixed inset-0 cursor-pointer bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <div
          className="relative z-10 w-full max-w-lg rounded-[1.75rem] border border-white/[0.08] bg-[#0d0d12] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.75)] sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            Close
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            Product review
          </p>
          <h2 id="review-submit-title" className="mt-3 text-2xl font-semibold text-white">
            {productName}
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Apna experience share karein. Name aap ke profile se automatically aay ga.
          </p>

          {isLoading || eligibilityLoading ? (
            <p className="mt-8 text-sm text-zinc-500">Checking review eligibility...</p>
          ) : !isAuthenticated ? (
            <div className="mt-8 space-y-4">
              <p className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                Review dene ke liye pehle sign in karein.
              </p>
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white"
              >
                Sign in with email
              </button>
              <a
                href={getGoogleAuthUrl(typeof window !== "undefined" ? window.location.pathname : "/")}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-violet-500/35 hover:bg-white/[0.06]"
              >
                Continue with Google
              </a>
            </div>
          ) : !eligibility?.canReview ? (
            <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-4 text-sm leading-7 text-amber-100">
              {eligibility?.message}
            </div>
          ) : !profileName ? (
            <div className="mt-8 space-y-4">
              <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-4 text-sm leading-7 text-amber-100">
                Profile mein name missing hai. Pehle apna name update karein.
              </p>
              <a
                href="/account/profile"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white"
              >
                Go to profile
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className={labelClassName}>Your name</p>
                <p className="mt-2 text-sm font-medium text-white">{profileName}</p>
                <p className="mt-1 text-xs text-zinc-500">{user?.email}</p>
              </div>

              <label className="flex flex-col gap-2.5">
                <span className={labelClassName}>City</span>
                <input
                  type="text"
                  value={customerCity}
                  onChange={(event) => setCustomerCity(event.target.value)}
                  required
                  placeholder="Lahore"
                  className={inputClassName}
                />
              </label>

              <div>
                <p className={labelClassName}>Rating</p>
                <div className="mt-2">
                  <StarRatingInput value={rating} onChange={setRating} />
                </div>
              </div>

              <label className="flex flex-col gap-2.5">
                <span className={labelClassName}>Review title</span>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  maxLength={120}
                  placeholder="Great quality and fast delivery"
                  className={inputClassName}
                />
              </label>

              <label className="flex flex-col gap-2.5">
                <span className={labelClassName}>Your review</span>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  required
                  rows={4}
                  maxLength={800}
                  placeholder="Product quality, packaging, delivery experience..."
                  className={`${inputClassName} resize-none`}
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_32px_rgba(139,92,246,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit review"}
              </button>
            </form>
          )}
        </div>
      </div>

      <CheckoutAuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
      />
    </>,
    document.body,
  );
}
