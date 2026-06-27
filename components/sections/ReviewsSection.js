"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import {
  getPublishedReviews,
  REVIEWS_CHANGED_EVENT,
} from "../../lib/reviews/review-storage";
import SectionHeading from "../ui/SectionHeading";
import { ReviewsSliderShimmer } from "../ui/LandingShimmers";
import StarRating from "../ui/StarRating";
import { SliderNav } from "../ui/SliderNav";
import Reveal from "../ui/Reveal";
import {
  bindSliderNavigation,
  configureSwiperNavigation,
} from "../../lib/swiper/bindSliderNavigation";

import "swiper/css";

export default function ReviewsSection({
  emptyMessage = "No reviews found.",
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadReviews() {
      setReviews(getPublishedReviews());
      setLoading(false);
    }

    loadReviews();
    window.addEventListener(REVIEWS_CHANGED_EVENT, loadReviews);
    return () => window.removeEventListener(REVIEWS_CHANGED_EVENT, loadReviews);
  }, []);

  const hasReviews = reviews.length > 0;
  const showSlider = !loading && hasReviews;

  return (
    <section className="relative overflow-hidden border-t border-[#2A2A2A] bg-[#0A0A0A] py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFB347]/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#FFB347]/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Customer Reviews"
            title="Trusted by thousands across Pakistan"
            subtitle="Real feedback from verified Zanvara shoppers — quality, delivery, and support you can count on."
            actions={showSlider ? <SliderNav prevRef={prevRef} nextRef={nextRef} /> : null}
          />
        </Reveal>

        <Reveal delay={120}>
          {loading ? <ReviewsSliderShimmer /> : null}

          {!loading && !hasReviews ? (
            <p className="py-8 text-center text-sm text-[#6B6B6B]">{emptyMessage}</p>
          ) : null}

          {showSlider ? (
            <div className="overflow-hidden">
              <Swiper
                modules={[Navigation, A11y]}
                spaceBetween={20}
                slidesPerView={1}
                speed={650}
                grabCursor
                watchOverflow
                breakpoints={{
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1280: { slidesPerView: 3, spaceBetween: 24 },
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => configureSwiperNavigation(swiper, prevRef, nextRef)}
                onSwiper={(swiper) => bindSliderNavigation(swiper, prevRef, nextRef)}
                className="reviews-swiper py-2"
              >
                {reviews.map((review) => (
                  <SwiperSlide key={review.id} className="h-auto">
                    <article className="flex h-full flex-col rounded-[1.75rem] border border-[#2A2A2A] bg-[#1A1A1A] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                      <div className="flex items-start justify-between gap-3">
                        <StarRating rating={review.rating} />
                        {review.verified ? (
                          <span className="rounded-full border border-[#FFB347]/25 bg-[#FFB347]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#FFD9A6]">
                            Verified
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-white">{review.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-7 text-[#A3A3A3]">
                        &ldquo;{review.comment}&rdquo;
                      </p>

                      <div className="mt-6 border-t border-[#2A2A2A] pt-4">
                        <p className="font-medium text-white">{review.customerName}</p>
                        <p className="mt-1 text-xs text-[#6B6B6B]">
                          {review.customerCity} · {review.productName}
                        </p>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
