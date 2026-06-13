import HeroSection from "../sections/HeroSection";
import ProductSlider from "../sections/ProductSlider";
import CategorySlider from "../sections/CategorySlider";
import PromoBanner from "../sections/PromoBanner";
import {
  bestDeals,
  latestProducts,
  popularProducts,
} from "../../lib/data/products";

export default function LandingPage() {
  return (
    <>
      <HeroSection />

      <ProductSlider
        eyebrow="Customer Favorites"
        title="Popular Products"
        subtitle="The most-loved items this week — handpicked for quality, value, and style."
        products={popularProducts}
      />

      <div className="border-y border-white/[0.05] bg-white/[0.015]">
        <ProductSlider
          eyebrow="Just Landed"
          title="Latest Products"
          subtitle="Fresh arrivals dropping daily. Be the first to discover what's new at Zanvara."
          products={latestProducts}
        />
      </div>

      <PromoBanner />

      <ProductSlider
        eyebrow="Save Big Today"
        title="Best Deals"
        subtitle="Premium products at unbeatable prices — limited stock on top discounted picks."
        products={bestDeals}
      />

      <CategorySlider />
    </>
  );
}
