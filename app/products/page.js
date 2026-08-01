import { Suspense } from "react";
import ProductsCatalog from "../../components/products/ProductsCatalog";
import { buildPageMetadata } from "../../lib/seo/metadata";

function humanizeCategorySlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const category = params?.category?.trim();

  if (category && category !== "all") {
    const label = humanizeCategorySlug(category);
    return buildPageMetadata({
      title: `${label} products`,
      description: `Shop ${label} at Zanvara. Premium kinetic sand tables and calm-living products with cash on delivery in Pakistan.`,
      path: `/products?category=${encodeURIComponent(category)}`,
      keywords: ["Zanvara", label, "kinetic sand table", "Pakistan online store"],
    });
  }

  return buildPageMetadata({
    title: "Shop all products",
    description:
      "Browse Zanvara kinetic sand tables and calm-living products. Filter by category, price, and deals. Cash on delivery available across Pakistan.",
    path: "/products",
    keywords: [
      "Zanvara catalog",
      "sand tables",
      "shop kinetic sand table",
      "Pakistan online store",
    ],
  });
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsCatalog />
    </Suspense>
  );
}
