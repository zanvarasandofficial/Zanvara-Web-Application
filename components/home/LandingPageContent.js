"use client";

import { useEffect, useState } from "react";
import HeroSection from "../sections/HeroSection";
import ProductSlider from "../sections/ProductSlider";
import CategorySlider from "../sections/CategorySlider";
import ReviewsSection from "../sections/ReviewsSection";
import PromoBanner from "../sections/PromoBanner";
import { fetchHeroSettings } from "../../lib/api/hero";
import { fetchLandingProducts } from "../../lib/api/products";

function LandingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="min-h-[70vh] bg-[#0a0a0f]" />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-8 w-48 rounded-full bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[4/5] rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPageContent() {
  const [hero, setHero] = useState(null);
  const [landingProducts, setLandingProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadLandingData() {
      setLoading(true);
      setLoadError("");

      try {
        const [heroData, productsData] = await Promise.all([
          fetchHeroSettings(),
          fetchLandingProducts(),
        ]);

        if (!active) return;

        setHero(heroData);
        setLandingProducts(productsData ?? { popular: [], latest: [], bestDeals: [] });

        if (!heroData?.mediaUrl && !productsData?.latest?.length) {
          setLoadError(
            "Store content load nahi ho saka. Backend chal raha hai? Zanvara Backend folder mein npm run dev chalao.",
          );
        }
      } catch {
        if (active) {
          setLoadError(
            "Store content load nahi ho saka. Backend chal raha hai? Zanvara Backend folder mein npm run dev chalao.",
          );
          setLandingProducts({ popular: [], latest: [], bestDeals: [] });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLandingData();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LandingSkeleton />;
  }

  const { popular = [], latest = [], bestDeals = [] } = landingProducts ?? {};

  return (
    <>
      {loadError ? (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100">
          {loadError}
        </div>
      ) : null}

      <HeroSection hero={hero} />

      {popular.length > 0 ? (
        <ProductSlider
          eyebrow="Customer Favorites"
          title="Popular Products"
          subtitle="The most-loved items this week — handpicked for quality, value, and style."
          products={popular}
        />
      ) : null}

      {latest.length > 0 ? (
        <div className="border-y border-white/[0.05] bg-white/[0.015]">
          <ProductSlider
            eyebrow="Just Landed"
            title="Latest Products"
            subtitle="Fresh arrivals dropping daily. Be the first to discover what's new at Zanvara."
            products={latest}
          />
        </div>
      ) : null}

      <PromoBanner />

      {bestDeals.length > 0 ? (
        <ProductSlider
          eyebrow="Save Big Today"
          title="Best Deals"
          subtitle="Premium products at unbeatable prices — limited stock on top discounted picks."
          products={bestDeals}
        />
      ) : null}

      <CategorySlider />

      <ReviewsSection />
    </>
  );
}
