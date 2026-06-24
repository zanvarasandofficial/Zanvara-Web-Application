import { Suspense } from "react";
import ProductsCatalog from "../../components/products/ProductsCatalog";

export const metadata = {
  title: "All Products | Zanvara",
  description: "Browse and filter the full Zanvara product catalog.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsCatalog />
    </Suspense>
  );
}
