"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "../../lib/api/admin-client";
import {
  saveAdminReview,
  updateReviewByAdmin,
} from "../../lib/reviews/review-storage";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
  adminSelectClassName,
} from "../../lib/ui/adminStyles";
import StarRatingInput from "../reviews/StarRatingInput";

const emptyForm = {
  productId: "",
  customerName: "",
  customerCity: "",
  rating: 5,
  title: "",
  comment: "",
  status: "Published",
  verified: true,
};

export default function AdminReviewFormModal({
  open,
  mode = "add",
  review = null,
  onClose,
  onSaved,
}) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setIsSaving(false);
      return;
    }

    if (mode === "edit" && review) {
      setForm({
        productId: review.productId || "",
        customerName: review.customerName || "",
        customerCity: review.customerCity || "",
        rating: review.rating || 5,
        title: review.title || "",
        comment: review.comment || "",
        status: review.status || "Pending",
        verified: Boolean(review.verified),
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, mode, review]);

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadProducts() {
      setLoadingProducts(true);
      setProductError("");

      try {
        const data = await adminFetch("/admin/products");
        if (active) {
          setProducts(data);
        }
      } catch (error) {
        if (active) {
          setProductError(error.message ?? "Could not load products.");
        }
      } finally {
        if (active) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [open]);

  const selectedProduct = products.find((product) => product.id === form.productId);

  function handleProductChange(productId) {
    const product = products.find((item) => item.id === productId);
    setForm((current) => ({
      ...current,
      productId,
    }));

    if (!product) return;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.productId) {
      return;
    }

    const productName = selectedProduct?.name || review?.productName || "";
    const payload = {
      productId: form.productId,
      productName,
      customerName: form.customerName.trim(),
      customerCity: form.customerCity.trim(),
      rating: Number(form.rating),
      title: form.title.trim(),
      comment: form.comment.trim(),
      status: form.status,
      verified: form.verified,
    };

    setIsSaving(true);

    try {
      if (mode === "edit" && review) {
        updateReviewByAdmin(review.id, payload);
      } else {
        saveAdminReview(payload);
      }

      onSaved?.();
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 pt-[max(1rem,8vh)] sm:items-center">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {mode === "edit" ? "Edit review" : "Add review"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "edit"
                ? review?.id
                : "Product select karein aur review details fill karein."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2">
            <span className={adminLabelClassName}>Product</span>
            <select
              value={form.productId}
              onChange={(event) => handleProductChange(event.target.value)}
              required
              disabled={loadingProducts}
              className={adminSelectClassName}
            >
              <option value="">
                {loadingProducts ? "Loading products..." : "Select a product"}
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {productError ? (
              <span className="text-xs text-rose-600">{productError}</span>
            ) : null}
            {selectedProduct ? (
              <span className="text-xs text-slate-500">
                Selected: {selectedProduct.name}
                {selectedProduct.category ? ` · ${selectedProduct.category}` : ""}
              </span>
            ) : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Customer name</span>
              <input
                value={form.customerName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customerName: event.target.value,
                  }))
                }
                required
                placeholder="Ali Khan"
                className={adminInputClassName}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>City</span>
              <input
                value={form.customerCity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customerCity: event.target.value,
                  }))
                }
                required
                placeholder="Lahore"
                className={adminInputClassName}
              />
            </label>
          </div>

          <div>
            <span className={adminLabelClassName}>Rating</span>
            <div className="mt-2">
              <StarRatingInput
                value={form.rating}
                onChange={(rating) => setForm((current) => ({ ...current, rating }))}
              />
            </div>
          </div>

          <label className="flex flex-col gap-2">
            <span className={adminLabelClassName}>Review title</span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              required
              maxLength={120}
              placeholder="Excellent quality"
              className={adminInputClassName}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={adminLabelClassName}>Review comment</span>
            <textarea
              value={form.comment}
              onChange={(event) =>
                setForm((current) => ({ ...current, comment: event.target.value }))
              }
              required
              rows={4}
              maxLength={800}
              placeholder="Share the customer experience..."
              className={`${adminInputClassName} resize-none`}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Status</span>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value }))
                }
                className={adminSelectClassName}
              >
                <option value="Pending">Pending</option>
                <option value="Published">Published</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>
            <label className="mt-6 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    verified: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Verified delivery
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving || loadingProducts || !form.productId}
              className={adminPrimaryButtonClassName}
            >
              {isSaving
                ? "Saving..."
                : mode === "edit"
                  ? "Save changes"
                  : "Add review"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={adminSecondaryButtonClassName}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
