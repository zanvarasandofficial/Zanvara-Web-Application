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
        <Reveal immediate className="max-w-2xl">
          <p
            className={`mb-4 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${landingEyebrow}`}
          >
            Premium Collection 2026
          </p>

          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover products that{" "}
            <span className={landingGradientText}>elevate your lifestyle</span>
          </h1>

          <p className="mt-6 text-base leading-8 text-[#A3A3A3] sm:text-lg">
            From trending tech to everyday essentials — shop curated picks with fast
            delivery, secure checkout, and exclusive member deals.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/products" className={landingPrimaryBtn}>
              Shop All Products
            </Link>
            <Link href="/products" className={landingOutlineBtn}>
              View Best Deals
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {[
              { value: stats.products, label: "Products" },
              { value: stats.customers, label: "Happy Customers" },
              { value: stats.rating, label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-[#FFD9A6]">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#6B6B6B]">
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
