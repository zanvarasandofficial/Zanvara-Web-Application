import { notFound } from "next/navigation";
import ProductDetail from "../../../components/products/ProductDetail";
import { allProducts, getProductById } from "../../../lib/data/products";

export function generateStaticParams() {
  return allProducts.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Product Not Found | Zanvara" };
  }

  return {
    title: `${product.name} | Zanvara`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
