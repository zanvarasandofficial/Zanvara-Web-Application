import { notFound } from "next/navigation";
import ProductDetail from "../../../components/products/ProductDetail";
import JsonLd from "../../../components/seo/JsonLd";
import { fetchProductById } from "../../../lib/api/products";
import { buildBreadcrumbSchema, buildProductSchema } from "../../../lib/seo/json-ld";
import { buildProductMetadata } from "../../../lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await fetchProductById(id);
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const structuredData = [
    buildProductSchema(product),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: product.name, path: `/products/${product.id}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <ProductDetail product={product} />
    </>
  );
}
