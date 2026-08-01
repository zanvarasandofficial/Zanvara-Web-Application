"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productCategories, formatPrice, getDiscountPercent } from "../../lib/products/pricing";
import { formatUsdAmount } from "../../lib/money/format";
import { adminFetch, uploadProductImage } from "../../lib/api/admin-client";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
  adminSelectClassName,
} from "../../lib/ui/adminStyles";
import RichTextEditor from "./RichTextEditor";

const emptyForm = {
  name: "",
  description: "",
  detailsHtml: "",
  specsHtml: "",
  whatsIncludedHtml: "",
  shippingReturnsHtml: "",
  category: productCategories[0] ?? "KINETIC SAND TABLES",
  originalPrice: "",
  priceAfterDiscount: "",
  originalPriceUsd: "",
  priceAfterDiscountUsd: "",
  stock: "",
  badge: "",
  status: "PUBLISHED",
  isPopular: false,
  deliveryType: "FREE",
  deliveryCharge: "",
  isComingSoon: false,
  comingSoonMode: "days",
  comingSoonDays: "7",
  comingSoonAt: "",
  isPreOrder: false,
  preOrderCapacity: "25",
  expectedShipMode: "days",
  expectedShipDays: "21",
  expectedShipAt: "",
  expectedShipNote: "",
};

function buildPreOrderPayload(form) {
  if (!form.isPreOrder) {
    return { isPreOrder: false };
  }

  const capacity = Number(form.preOrderCapacity);
  if (!Number.isFinite(capacity) || capacity < 1) {
    throw new Error("Enter pre-order capacity (minimum 1 unit).");
  }

  let expectedShipAt;
  if (form.expectedShipMode === "days") {
    const days = Number(form.expectedShipDays);
    if (!Number.isFinite(days) || days < 1) {
      throw new Error("Enter expected ship timeline in days (1 or more).");
    }
    expectedShipAt = new Date(Date.now() + days * 86400000).toISOString();
  } else if (form.expectedShipAt) {
    const shipDate = new Date(form.expectedShipAt);
    if (Number.isNaN(shipDate.getTime())) {
      throw new Error("Invalid expected ship date.");
    }
    expectedShipAt = shipDate.toISOString();
  }

  const expectedShipNote = form.expectedShipNote.trim() || null;
  if (!expectedShipAt && !expectedShipNote) {
    throw new Error("Add expected ship date or a short ship window note.");
  }

  return {
    isPreOrder: true,
    preOrderCapacity: capacity,
    expectedShipAt,
    expectedShipNote,
  };
}

function buildFulfillmentPayload(form) {
  if (form.isComingSoon) {
    return { ...buildComingSoonPayload(form), isPreOrder: false };
  }

  if (form.isPreOrder) {
    return { ...buildPreOrderPayload(form), isComingSoon: false };
  }

  return { isComingSoon: false, isPreOrder: false };
}

function toDatetimeLocalValue(iso) {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildComingSoonPayload(form) {
  if (!form.isComingSoon) {
    return { isComingSoon: false };
  }

  if (form.comingSoonMode === "days") {
    const days = Number(form.comingSoonDays);
    if (!Number.isFinite(days) || days < 1) {
      throw new Error("Enter how many days until launch (1 or more).");
    }

    return {
      isComingSoon: true,
      availableAt: new Date(Date.now() + days * 86400000).toISOString(),
    };
  }

  if (!form.comingSoonAt) {
    throw new Error("Pick launch date and time.");
  }

  const launchDate = new Date(form.comingSoonAt);
  if (Number.isNaN(launchDate.getTime())) {
    throw new Error("Invalid launch date.");
  }

  return {
    isComingSoon: true,
    availableAt: launchDate.toISOString(),
  };
}

function mapInitialValues(product) {
  if (!product) return emptyForm;

  return {
    name: product.name ?? "",
    description: product.description ?? "",
    detailsHtml: product.detailsHtml ?? "",
    specsHtml: product.specsHtml ?? "",
    whatsIncludedHtml: product.whatsIncludedHtml ?? "",
    shippingReturnsHtml: product.shippingReturnsHtml ?? "",
    category: product.category ?? productCategories[0],
    originalPrice: product.originalPrice?.toString() ?? "",
    priceAfterDiscount: product.priceAfterDiscount?.toString() ?? "",
    originalPriceUsd: product.originalPriceUsd?.toString() ?? "",
    priceAfterDiscountUsd: product.priceAfterDiscountUsd?.toString() ?? "",
    stock: product.stock?.toString() ?? "",
    badge: product.badge ?? "",
    status: product.status ?? "PUBLISHED",
    isPopular: Boolean(product.isPopular),
    deliveryType: product.deliveryType ?? "FREE",
    deliveryCharge:
      product.deliveryType === "CHARGED" && product.deliveryCharge != null
        ? product.deliveryCharge.toString()
        : "",
    isComingSoon: Boolean(product.isComingSoon),
    comingSoonMode: product.availableAt ? "datetime" : "days",
    comingSoonDays: "7",
    comingSoonAt: toDatetimeLocalValue(product.availableAt),
    isPreOrder: Boolean(product.isPreOrder),
    preOrderCapacity: product.preOrderCapacity?.toString() ?? "25",
    expectedShipMode: product.expectedShipAt ? "datetime" : "days",
    expectedShipDays: "21",
    expectedShipAt: toDatetimeLocalValue(product.expectedShipAt),
    expectedShipNote: product.expectedShipNote ?? "",
  };
}

function isValidHttpUrl(value) {
  if (!value || typeof value !== "string") return false;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Omit empty accordion fields so older API builds still accept product saves. */
function buildAccordionPayload(form) {
  const specsHtml = form.specsHtml.trim() || null;
  const whatsIncludedHtml = form.whatsIncludedHtml.trim() || null;
  const shippingReturnsHtml = form.shippingReturnsHtml.trim() || null;
  const hasAny = specsHtml || whatsIncludedHtml || shippingReturnsHtml;

  if (!hasAny) {
    return {};
  }

  return { specsHtml, whatsIncludedHtml, shippingReturnsHtml };
}

function mapGalleryFromProduct(product) {
  const urls = product?.galleryImageUrls ?? [];
  const publicIds = product?.galleryImagePublicIds ?? [];

  return urls.map((url, index) => ({
    id: `existing-${index}-${url}`,
    url,
    publicId: publicIds[index] ?? "",
    file: null,
    previewUrl: "",
  }));
}

export default function ProductForm({
  mode = "create",
  initialValues = null,
  productId,
}) {
  const router = useRouter();
  const [form, setForm] = useState(() => mapInitialValues(initialValues));
  const [mainImageUrl, setMainImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [hoverImageUrl, setHoverImageUrl] = useState(initialValues?.hoverImageUrl ?? "");
  const [mainImagePublicId, setMainImagePublicId] = useState(initialValues?.imagePublicId ?? "");
  const [hoverImagePublicId, setHoverImagePublicId] = useState(
    initialValues?.hoverImagePublicId ?? "",
  );
  const [mainImageFile, setMainImageFile] = useState(null);
  const [hoverImageFile, setHoverImageFile] = useState(null);
  const [mainPreviewUrl, setMainPreviewUrl] = useState("");
  const [hoverPreviewUrl, setHoverPreviewUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState(() => mapGalleryFromProduct(initialValues));
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!mainImageFile) {
      setMainPreviewUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(mainImageFile);
    setMainPreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [mainImageFile]);

  useEffect(() => {
    if (!hoverImageFile) {
      setHoverPreviewUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(hoverImageFile);
    setHoverPreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [hoverImageFile]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await adminFetch("/admin/categories");
        const names = Array.isArray(data)
          ? data
              .filter((item) => item.isActive !== false)
              .map((item) => item.name)
              .filter(Boolean)
          : [];

        if (!active || !names.length) return;

        setCategoryOptions(names);
        setForm((current) => ({
          ...current,
          category: names.includes(current.category) ? current.category : names[0],
        }));
      } catch {
        // Keep existing category value if admin categories fail to load.
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!initialValues) return;

    setForm(mapInitialValues(initialValues));
    setMainImageUrl(initialValues.imageUrl ?? "");
    setHoverImageUrl(initialValues.hoverImageUrl ?? "");
    setMainImagePublicId(initialValues.imagePublicId ?? "");
    setHoverImagePublicId(initialValues.hoverImagePublicId ?? "");
    setMainImageFile(null);
    setHoverImageFile(null);
    setGalleryImages(mapGalleryFromProduct(initialValues));
  }, [initialValues?.id, initialValues?.updatedAt]);

  const discountPercent = useMemo(() => {
    const originalPrice = Number(form.originalPrice);
    const priceAfterDiscount = form.priceAfterDiscount
      ? Number(form.priceAfterDiscount)
      : null;

    return getDiscountPercent(originalPrice, priceAfterDiscount);
  }, [form.originalPrice, form.priceAfterDiscount]);

  function updateField(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "isComingSoon" && value) {
        next.isPreOrder = false;
      }
      if (field === "isPreOrder" && value) {
        next.isComingSoon = false;
      }
      return next;
    });
  }

  function handleAddGalleryImages(event) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setGalleryImages((current) => [
      ...current,
      ...files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url: "",
        publicId: "",
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);

    event.target.value = "";
  }

  function removeGalleryImage(id) {
    setGalleryImages((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return current.filter((entry) => entry.id !== id);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const originalPrice = Number(form.originalPrice);
      const priceAfterDiscount = form.priceAfterDiscount
        ? Number(form.priceAfterDiscount)
        : null;

      if (!form.name.trim()) {
        throw new Error("Product name is required.");
      }

      if (!originalPrice || originalPrice <= 0) {
        throw new Error("Original price is required.");
      }

      if (
        priceAfterDiscount != null &&
        (priceAfterDiscount <= 0 || priceAfterDiscount >= originalPrice)
      ) {
        throw new Error("Price after discount must be lower than original price.");
      }

      const originalPriceUsd = form.originalPriceUsd.trim()
        ? Number(form.originalPriceUsd)
        : null;
      const priceAfterDiscountUsd = form.priceAfterDiscountUsd.trim()
        ? Number(form.priceAfterDiscountUsd)
        : null;

      if (originalPriceUsd != null && originalPriceUsd <= 0) {
        throw new Error("Original USD price must be greater than zero.");
      }

      if (priceAfterDiscountUsd != null && originalPriceUsd == null) {
        throw new Error("Enter original USD price when setting a USD sale price.");
      }

      if (
        priceAfterDiscountUsd != null &&
        (priceAfterDiscountUsd <= 0 || priceAfterDiscountUsd >= originalPriceUsd)
      ) {
        throw new Error("USD sale price must be lower than original USD price.");
      }

      const deliveryType = form.deliveryType;
      const deliveryCharge =
        deliveryType === "CHARGED" && form.deliveryCharge
          ? Number(form.deliveryCharge)
          : null;

      if (deliveryType === "CHARGED" && (!deliveryCharge || deliveryCharge <= 0)) {
        throw new Error("Enter a valid delivery charge or choose free delivery.");
      }

      let nextMainImageUrl = mainImageUrl;
      let nextHoverImageUrl = hoverImageUrl;
      let nextMainPublicId = mainImagePublicId;
      let nextHoverPublicId = hoverImagePublicId;

      if (mainImageFile) {
        const uploaded = await uploadProductImage(mainImageFile);
        nextMainImageUrl = uploaded.url;
        nextMainPublicId = uploaded.publicId;
      }

      if (hoverImageFile) {
        const uploaded = await uploadProductImage(hoverImageFile);
        nextHoverImageUrl = uploaded.url;
        nextHoverPublicId = uploaded.publicId;
      }

      if (!nextMainImageUrl) {
        throw new Error("Main product image is required.");
      }

      const uploadedGallery = await Promise.all(
        galleryImages.map(async (item) => {
          if (item.file) {
            const uploaded = await uploadProductImage(item.file);
            return { url: uploaded.url, publicId: uploaded.publicId };
          }

          return { url: item.url, publicId: item.publicId || "" };
        }),
      );

      const galleryPairs = uploadedGallery.filter((item) => isValidHttpUrl(item.url));

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        detailsHtml: form.detailsHtml.trim() || null,
        ...buildAccordionPayload(form),
        category: form.category,
        originalPrice,
        priceAfterDiscount,
        originalPriceUsd,
        priceAfterDiscountUsd,
        badge: form.badge.trim() || null,
        imageUrl: nextMainImageUrl,
        hoverImageUrl: isValidHttpUrl(nextHoverImageUrl) ? nextHoverImageUrl.trim() : undefined,
        imagePublicId: nextMainPublicId || undefined,
        hoverImagePublicId: nextHoverPublicId || undefined,
        galleryImageUrls: galleryPairs.map((item) => item.url.trim()),
        galleryImagePublicIds: galleryPairs.map((item) => item.publicId || ""),
        stock: Number(form.stock || 0),
        status: form.status,
        isPopular: form.isPopular,
        deliveryType,
        deliveryCharge,
        ...buildFulfillmentPayload(form),
      };

      if (mode === "create") {
        await adminFetch("/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSuccess("Product created successfully.");
        router.push("/dashboard/admin/products");
        router.refresh();
        return;
      }

      const updated = await adminFetch(`/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setMainImageUrl(nextMainImageUrl);
      setHoverImageUrl(nextHoverImageUrl);
      setMainImagePublicId(nextMainPublicId);
      setHoverImagePublicId(nextHoverPublicId);
      setMainImageFile(null);
      setHoverImageFile(null);
      setGalleryImages(mapGalleryFromProduct(updated));
      setForm(mapInitialValues(updated));
      setSuccess("Product saved successfully.");
      router.push("/dashboard/admin/products");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message ?? "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  const mainPreview = mainPreviewUrl || mainImageUrl;
  const hoverPreview = hoverPreviewUrl || hoverImageUrl;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Basic information</h2>
            <div className="mt-5 space-y-5">
              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Product name</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Aura Wireless Headphones"
                  className={adminInputClassName}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Description</span>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Write a compelling product description..."
                  className={`${adminInputClassName} resize-none`}
                />
              </label>

              <div className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Details</span>
                <p className="text-sm text-slate-500">
                  Add formatted product details with bold, italic, color, bullet points, images,
                  and custom image width/height.
                </p>
                <RichTextEditor
                  value={form.detailsHtml}
                  onChange={(html) => updateField("detailsHtml", html)}
                  placeholder="Material, sizing, warranty, features..."
                />
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Product page sections (accordion)
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Expandable sections below add to cart. Leave empty to hide a section.
                </p>
                <div className="mt-5 space-y-5">
                  <div className="flex flex-col gap-2">
                    <span className={adminLabelClassName}>Specs</span>
                    <RichTextEditor
                      value={form.specsHtml}
                      onChange={(html) => updateField("specsHtml", html)}
                      placeholder="Dimensions, weight, power, materials..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={adminLabelClassName}>Shipping and Returns</span>
                    <RichTextEditor
                      value={form.shippingReturnsHtml}
                      onChange={(html) => updateField("shippingReturnsHtml", html)}
                      placeholder="Delivery times, return policy..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={adminLabelClassName}>What&apos;s Included?</span>
                    <RichTextEditor
                      value={form.whatsIncludedHtml}
                      onChange={(html) => updateField("whatsIncludedHtml", html)}
                      placeholder="Table, power adapter, sand, manual..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Pricing & inventory</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Original price (PKR)</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.originalPrice}
                  onChange={(event) => updateField("originalPrice", event.target.value)}
                  placeholder="18999"
                  className={adminInputClassName}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Price after discount (PKR)</span>
                <input
                  type="number"
                  min="1"
                  value={form.priceAfterDiscount}
                  onChange={(event) => updateField("priceAfterDiscount", event.target.value)}
                  placeholder="Leave empty if no discount"
                  className={adminInputClassName}
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className={adminLabelClassName}>International pricing (USD)</span>
                <p className="text-xs leading-5 text-slate-500">
                  Optional. When set, visitors outside Pakistan see these dollar amounts
                  instead of auto-converting from PKR.
                </p>
              </label>

              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Original price (USD)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.originalPriceUsd}
                  onChange={(event) => updateField("originalPriceUsd", event.target.value)}
                  placeholder="e.g. 299"
                  className={adminInputClassName}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Price after discount (USD)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.priceAfterDiscountUsd}
                  onChange={(event) =>
                    updateField("priceAfterDiscountUsd", event.target.value)
                  }
                  placeholder="Optional sale price in USD"
                  className={adminInputClassName}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Stock quantity</span>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                  placeholder="25"
                  className={adminInputClassName}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Badge label</span>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(event) => updateField("badge", event.target.value)}
                  placeholder="Popular, New, Hot"
                  className={adminInputClassName}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Delivery</span>
                <select
                  value={form.deliveryType}
                  onChange={(event) => updateField("deliveryType", event.target.value)}
                  className={adminSelectClassName}
                >
                  <option value="FREE">Free delivery</option>
                  <option value="CHARGED">Delivery charges apply</option>
                </select>
              </label>

              {form.deliveryType === "CHARGED" ? (
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className={adminLabelClassName}>Delivery charge (PKR)</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.deliveryCharge}
                    onChange={(event) => updateField("deliveryCharge", event.target.value)}
                    placeholder="250"
                    className={adminInputClassName}
                  />
                </label>
              ) : null}

              <div className="sm:col-span-2 rounded-xl border border-violet-200 bg-violet-50/60 p-4">
                <label className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-800">
                    Coming soon (live countdown on storefront)
                  </span>
                  <input
                    type="checkbox"
                    checked={form.isComingSoon}
                    onChange={(event) => updateField("isComingSoon", event.target.checked)}
                    className="h-4 w-4 accent-violet-600"
                  />
                </label>

                {form.isComingSoon ? (
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateField("comingSoonMode", "days")}
                        className={[
                          "rounded-lg px-3 py-2 text-xs font-semibold transition",
                          form.comingSoonMode === "days"
                            ? "bg-violet-600 text-white"
                            : "border border-violet-200 bg-white text-slate-600",
                        ].join(" ")}
                      >
                        Days from save
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField("comingSoonMode", "datetime")}
                        className={[
                          "rounded-lg px-3 py-2 text-xs font-semibold transition",
                          form.comingSoonMode === "datetime"
                            ? "bg-violet-600 text-white"
                            : "border border-violet-200 bg-white text-slate-600",
                        ].join(" ")}
                      >
                        Exact date & time
                      </button>
                    </div>

                    {form.comingSoonMode === "days" ? (
                      <label className="flex max-w-xs flex-col gap-2">
                        <span className={adminLabelClassName}>Launch in (days)</span>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={form.comingSoonDays}
                          onChange={(event) =>
                            updateField("comingSoonDays", event.target.value)
                          }
                          className={adminInputClassName}
                        />
                        <span className="text-xs text-slate-500">
                          Countdown starts when you save — e.g. 14 days from now.
                        </span>
                      </label>
                    ) : (
                      <label className="flex max-w-md flex-col gap-2">
                        <span className={adminLabelClassName}>Launch date & time</span>
                        <input
                          type="datetime-local"
                          value={form.comingSoonAt}
                          onChange={(event) =>
                            updateField("comingSoonAt", event.target.value)
                          }
                          className={adminInputClassName}
                        />
                        <span className="text-xs text-slate-500">
                          Uses your browser local time; customers see a live countdown until
                          then.
                        </span>
                      </label>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Enable to show a live launch timer and block Add to cart until the countdown
                    ends.
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                <label className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-800">
                    Pre-order (customers can order before stock arrives)
                  </span>
                  <input
                    type="checkbox"
                    checked={form.isPreOrder}
                    onChange={(event) => updateField("isPreOrder", event.target.checked)}
                    className="h-4 w-4 accent-amber-600"
                  />
                </label>

                {form.isPreOrder ? (
                  <div className="mt-4 space-y-4">
                    <label className="flex max-w-xs flex-col gap-2">
                      <span className={adminLabelClassName}>Pre-order capacity (units)</span>
                      <input
                        type="number"
                        min="1"
                        value={form.preOrderCapacity}
                        onChange={(event) =>
                          updateField("preOrderCapacity", event.target.value)
                        }
                        className={adminInputClassName}
                      />
                      <span className="text-xs text-slate-500">
                        Max tables customers can pre-order. Reserved automatically on checkout.
                      </span>
                    </label>

                    {productId && initialValues?.preOrderReserved ? (
                      <p className="text-xs font-medium text-amber-800">
                        Reserved so far: {initialValues.preOrderReserved} /{" "}
                        {initialValues.preOrderCapacity ?? form.preOrderCapacity}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateField("expectedShipMode", "days")}
                        className={[
                          "rounded-lg px-3 py-2 text-xs font-semibold transition",
                          form.expectedShipMode === "days"
                            ? "bg-amber-600 text-white"
                            : "border border-amber-200 bg-white text-slate-600",
                        ].join(" ")}
                      >
                        Ship in (days from save)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField("expectedShipMode", "datetime")}
                        className={[
                          "rounded-lg px-3 py-2 text-xs font-semibold transition",
                          form.expectedShipMode === "datetime"
                            ? "bg-amber-600 text-white"
                            : "border border-amber-200 bg-white text-slate-600",
                        ].join(" ")}
                      >
                        Exact ship date
                      </button>
                    </div>

                    {form.expectedShipMode === "days" ? (
                      <label className="flex max-w-xs flex-col gap-2">
                        <span className={adminLabelClassName}>Expected ship in (days)</span>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={form.expectedShipDays}
                          onChange={(event) =>
                            updateField("expectedShipDays", event.target.value)
                          }
                          className={adminInputClassName}
                        />
                      </label>
                    ) : (
                      <label className="flex max-w-md flex-col gap-2">
                        <span className={adminLabelClassName}>Expected ship date</span>
                        <input
                          type="datetime-local"
                          value={form.expectedShipAt}
                          onChange={(event) =>
                            updateField("expectedShipAt", event.target.value)
                          }
                          className={adminInputClassName}
                        />
                      </label>
                    )}

                    <label className="flex flex-col gap-2">
                      <span className={adminLabelClassName}>
                        Ship window note (optional if date set)
                      </span>
                      <input
                        type="text"
                        value={form.expectedShipNote}
                        onChange={(event) =>
                          updateField("expectedShipNote", event.target.value)
                        }
                        placeholder="e.g. Ships in 4–6 weeks after pre-order"
                        className={adminInputClassName}
                      />
                    </label>
                  </div>
                ) : (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Use pre-order for tables in production. Customers checkout with COD; slots
                    fill until capacity is reached.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {discountPercent != null ? (
                <>
                  Customer will see{" "}
                  <span className="font-semibold text-slate-900">
                    {formatPrice(Number(form.priceAfterDiscount))}
                  </span>{" "}
                  with{" "}
                  <span className="font-semibold text-[#F59E0B]">-{discountPercent}%</span>{" "}
                  off from {formatPrice(Number(form.originalPrice))}.
                </>
              ) : (
                <>
                  No discount applied. Customer will see{" "}
                  <span className="font-semibold text-slate-900">
                    {form.originalPrice
                      ? formatPrice(Number(form.originalPrice))
                      : "original price"}
                  </span>
                  .
                </>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Media</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <span className={adminLabelClassName}>Main image</span>
                <label className={`${adminSecondaryButtonClassName} cursor-pointer`}>
                  Choose main image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      setMainImageFile(event.target.files?.[0] ?? null);
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>

              <div className="space-y-3">
                <span className={adminLabelClassName}>Hover image (optional)</span>
                <label className={`${adminSecondaryButtonClassName} cursor-pointer`}>
                  Choose hover image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      setHoverImageFile(event.target.files?.[0] ?? null);
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="relative h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {mainPreview ? (
                  <Image
                    src={mainPreview}
                    alt="Main product preview"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    Main image preview
                  </div>
                )}
              </div>

              <div className="relative h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {hoverPreview ? (
                  <Image
                    src={hoverPreview}
                    alt="Hover product preview"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    Hover image preview
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className={adminLabelClassName}>Additional images</span>
                  <p className="mt-1 text-sm text-slate-500">
                    Extra photos shown on the product detail page with main and hover images.
                  </p>
                </div>
                <label className={`${adminSecondaryButtonClassName} cursor-pointer`}>
                  Add multiple images
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleAddGalleryImages}
                  />
                </label>
              </div>

              {galleryImages.length > 0 ? (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((item) => {
                    const preview = item.previewUrl || item.url;

                    return (
                      <div
                        key={item.id}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                      >
                        {preview ? (
                          <Image
                            src={preview}
                            alt="Gallery preview"
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : null}
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(item.id)}
                          className="absolute right-1 top-1 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white transition hover:bg-red-600"
                          aria-label="Remove gallery image"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  No extra images yet. Use &quot;Add multiple images&quot; to upload more photos.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Organization</h2>
            <div className="mt-5 space-y-5">
              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Category</span>
                <select
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className={adminSelectClassName}
                >
                  {(categoryOptions.length ? categoryOptions : productCategories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Status</span>
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  className={adminSelectClassName}
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Show in Popular Products
                </span>
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={(event) => updateField("isPopular", event.target.checked)}
                  className="h-4 w-4 accent-[#FFB347]"
                />
              </label>

              {productId ? (
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Product ID: <span className="font-medium text-slate-700">{productId}</span>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Actions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Images upload to Cloudinary only when you save. Published products appear on the
              landing page automatically.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className={`${adminPrimaryButtonClassName} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Product"
                    : "Save Changes"}
              </button>
              <Link href="/dashboard/admin/products" className={adminSecondaryButtonClassName}>
                Cancel
              </Link>
            </div>
          </section>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}
    </form>
  );
}
