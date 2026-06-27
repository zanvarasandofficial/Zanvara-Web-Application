"use client";

import { useEffect, useState } from "react";
import HeroSection from "../sections/HeroSection";
import ProductSlider from "../sections/ProductSlider";
import CategorySlider from "../sections/CategorySlider";
import ReviewsSection from "../sections/ReviewsSection";
import PromoBanner from "../sections/PromoBanner";
import { fetchStorefrontCategories } from "../../lib/api/categories";
import { fetchHeroSettings } from "../../lib/api/hero";
import { fetchLandingProducts } from "../../lib/api/products";

export default function LandingPageContent() {
  const [hero, setHero] = useState(null);
  const [landingProducts, setLandingProducts] = useState({
    popular: [],
    latest: [],
    bestDeals: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadLandingData() {
      setLoading(true);
      setLoadError("");

      try {
        const [heroData, productsData, categoriesData] = await Promise.all([
          fetchHeroSettings(),
          fetchLandingProducts(),
          fetchStorefrontCategories(),
        ]);

        if (!active) return;

        setHero(heroData);
        setLandingProducts(productsData ?? { popular: [], latest: [], bestDeals: [] });
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        if (!heroData?.mediaUrl && !productsData?.latest?.length) {
          setLoadError(
            "Store content load nahi ho saka. Frontend env check karo: NEXT_PUBLIC_API_URL = https://zanvara-backend.vercel.app/api",
          );
        }
      } catch {
        if (active) {
          setLoadError(
            "Store content load nahi ho saka. API URL ya CORS check karo. NEXT_PUBLIC_API_URL = https://zanvara-backend.vercel.app/api",
          );
          setLandingProducts({ popular: [], latest: [], bestDeals: [] });
          setCategories([]);
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

  const { popular = [], latest = [], bestDeals = [] } = landingProducts;

  return (
    <>
      {loadError ? (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100">
          {loadError}
        </div>
      ) : null}

      <HeroSection hero={hero} />

      <ProductSlider
        eyebrow="Customer Favorites"
        title="Popular Products"
        subtitle="The most-loved items this week — handpicked for quality, value, and style."
        products={popular}
        loading={loading}
      />

      <div className="border-y border-white/[0.05] bg-white/[0.015]">
        <ProductSlider
          eyebrow="Just Landed"
          title="Latest Products"
          subtitle="Fresh arrivals dropping daily. Be the first to discover what's new at Zanvara."
          products={latest}
          loading={loading}
        />
      </div>

      <PromoBanner />

      <ProductSlider
        eyebrow="Save Big Today"
        title="Best Deals"
        subtitle="Premium products at unbeatable prices — limited stock on top discounted picks."
        products={bestDeals}
        loading={loading}
      />

      <CategorySlider categories={categories} loading={loading} />

      <ReviewsSection />
    </>
  );
}
