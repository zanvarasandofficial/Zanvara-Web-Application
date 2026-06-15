import { notFound } from "next/navigation";
import ProductDetail from "../../../components/products/ProductDetail";
import { fetchProductById } from "../../../lib/api/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return { title: "Product Not Found | Zanvara" };
  }

  return {
    title: `${product.name} | Zanvara`,
    description: product.description ?? `Shop ${product.name} at Zanvara.`,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
