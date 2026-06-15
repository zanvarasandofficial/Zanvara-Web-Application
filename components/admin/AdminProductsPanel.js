"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminPageHeader from "./AdminPageHeader";
import StatusBadge from "./StatusBadge";
import { adminFetch } from "../../lib/api/admin-client";
import { formatPrice } from "../../lib/products/pricing";
import {
  adminCardClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "../../lib/ui/adminStyles";

export default function AdminProductsPanel() {
  const pathname = usePathname();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await adminFetch("/admin/products");

        if (active) {
          setProducts(data);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message ?? "Could not load products.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [pathname]);

  async function handleDelete(productId) {
    if (!window.confirm("Delete this product permanently?")) {
      return;
    }

    setDeletingId(productId);
    setError("");

    try {
      await adminFetch(`/admin/products/${productId}`, { method: "DELETE" });
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch (deleteError) {
      setError(deleteError.message ?? "Could not delete product.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        description="Manage your full product catalog, pricing, stock, and publishing status."
        action={
          <Link href="/dashboard/admin/products/new" className={adminPrimaryButtonClassName}>
            Add Product
          </Link>
        }
      />

      <section className={`${adminCardClassName} mt-8 overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">All products</h2>
            <p className="text-sm text-slate-500">
              {loading ? "Loading..." : `${products.length} items in catalog`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-sm text-slate-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-500">
            No products yet. Add your first product to show it on the landing page.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Stock</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-slate-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">
                            {product.isPopular ? "Popular" : "Standard"}
                            {product.discountPercent != null
                              ? ` · -${product.discountPercent}%`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.category}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.stock}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status === "PUBLISHED" ? "Published" : "Draft"} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/admin/products/${product.id}`}
                          className={adminSecondaryButtonClassName}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === product.id}
                          onClick={() => handleDelete(product.id)}
                          className="rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </>
  );
}
