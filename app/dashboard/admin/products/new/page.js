import Link from "next/link";
import AdminPageHeader from "../../../../../components/admin/AdminPageHeader";
import ProductForm from "../../../../../components/admin/ProductForm";
import { adminSecondaryButtonClassName } from "../../../../../lib/ui/adminStyles";

export const metadata = {
  title: "Add Product | Zanvara Admin",
};

export default function AdminNewProductPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Add product"
        description="Create a new product listing for the storefront catalog."
        action={
          <Link href="/dashboard/admin/products" className={adminSecondaryButtonClassName}>
            Back to products
          </Link>
        }
      />

      <div className="mt-8">
        <ProductForm mode="create" />
      </div>
    </>
  );
}
