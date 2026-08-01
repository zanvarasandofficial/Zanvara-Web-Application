"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "../ui/Reveal";
import HeroMediaBackground from "./HeroMediaBackground";
import {
  landingOutlineBtn,
  landingPrimaryBtn,
  landingEyebrow,
  landingGradientText,
} from "../../lib/ui/theme";
import {
  fetchStorefrontStats,
  formatHeroCount,
  formatHeroRating,
} from "../../lib/api/storefront-stats";
import {
  getReviewSummary,
  REVIEWS_CHANGED_EVENT,
} from "../../lib/reviews/review-storage";

export default function HeroSection({ hero }) {
  const mediaType = hero?.mediaType ?? "video";
  const mediaUrl = hero?.mediaUrl ?? "";
  const [stats, setStats] = useState({
    products: "—",
    customers: "—",
    rating: "—",
  });

  useEffect(() => {
    function applyStats(apiStats, ratingValue) {
      setStats({
        products: formatHeroCount(apiStats?.productCount ?? 0),
        customers: formatHeroCount(apiStats?.customerCount ?? 0),
        rating: formatHeroRating(ratingValue),
      });
    }

    async function loadStats() {
      let ratingValue = 0;

      try {
        const summary = await getReviewSummary();
        ratingValue = summary?.average ?? 0;
      } catch {
        ratingValue = 0;
      }

      try {
        const apiStats = await fetchStorefrontStats();
        applyStats(apiStats, ratingValue);
      } catch {
        applyStats({ productCount: 0, customerCount: 0 }, ratingValue);
      }
    }

    loadStats();

    function handleReviewsChanged() {
      loadStats();
    }

    window.addEventListener(REVIEWS_CHANGED_EVENT, handleReviewsChanged);
    const interval = window.setInterval(loadStats, 60000);

    return () => {
      window.removeEventListener(REVIEWS_CHANGED_EVENT, handleReviewsChanged);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-[#0A0A0A] sm:min-h-[78vh] lg:min-h-[85vh]">
      <HeroMediaBackground mediaType={mediaType} mediaUrl={mediaUrl} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-[calc(4.5rem+2.5rem)] sm:px-6 sm:pb-14 sm:pt-[calc(4.5rem+3.5rem)] lg:px-8 lg:pb-16 lg:pt-[calc(4.5rem+4rem)]">
        <Reveal immediate className="max-w-xl sm:max-w-2xl">
          <p
            className={`mb-3 inline-flex max-w-full items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] sm:mb-4 sm:text-[11px] sm:tracking-[0.24em] ${landingEyebrow}`}
          >
            Premium Collection 2026
          </p>

          <h1 className="text-[1.75rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Where Precision Tech Meets{" "}
            <span className={landingGradientText}>Mindful Art</span>
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#B8B8B8] sm:mt-6 sm:text-base sm:leading-8 sm:text-[#A3A3A3] lg:text-lg">
            Experience continuous motion and quiet elegance. Zanvara kinetic tables trace
            hypnotic patterns in sand—bringing tranquility and art into your space.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link href="/products" className={`${landingPrimaryBtn} w-full justify-center sm:w-auto`}>
              Shop All Products
            </Link>
            <Link href="/products" className={`${landingOutlineBtn} w-full justify-center sm:w-auto`}>
              View Best Deals
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-10 sm:gap-4 sm:pt-8">
            {[
              { value: stats.products, label: "Products" },
              { value: stats.customers, label: "Happy Customers" },
              { value: stats.rating, label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="text-xl font-bold text-[#FFD9A6] sm:text-2xl">{stat.value}</p>
                <p className="mt-1 text-[10px] uppercase leading-snug tracking-[0.12em] text-[#6B6B6B] sm:text-xs sm:tracking-[0.18em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
