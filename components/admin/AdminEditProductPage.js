"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "./AdminPageHeader";
import ProductForm from "./ProductForm";
import { adminFetch } from "../../lib/api/admin-client";
import { adminSecondaryButtonClassName } from "../../lib/ui/adminStyles";

export default function AdminEditProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const data = await adminFetch(`/admin/products/${productId}`);

        if (active) {
          setProduct(data);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message ?? "Could not load product.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Edit product"
        description="Update pricing, images, stock, and landing page visibility."
        action={
          <Link href="/dashboard/admin/products" className={adminSecondaryButtonClassName}>
            Back to products
          </Link>
        }
      />

      {loading ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-sm text-slate-500">
          Loading product...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="mt-8">
          <ProductForm mode="edit" initialValues={product} productId={productId} />
        </div>
      )}
    </>
  );
}
