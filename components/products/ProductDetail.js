"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../lib/data/products";
import { formatDeliveryLabel } from "../../lib/products/delivery";
import Reveal from "../ui/Reveal";
import ProductImageZoom from "./ProductImageZoom";
import ProductDetailsContent from "./ProductDetailsContent";
import ProductReviews from "./ProductReviews";

export default function ProductDetail({ product }) {
  const { addItem, items } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const cartItem = items.find((item) => item.productId === product.id);
  const isInCart = Boolean(cartItem);

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const badgeLabel = product.badge?.trim();
  const deliveryLabel = formatDeliveryLabel(product);
  const deliveryIsFree = deliveryLabel === "Free";

  function handleAddToCart() {
    const result = addItem(product, quantity);
    if (result.ok) {
      showToast(`${product.name} added to cart`);
    } else {
      showToast(result.message, "error");
    }
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(product.stock, current + 1));
  }

  return (
    <div className="pb-12 pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="transition-colors hover:text-white">
              Products
            </Link>
            <span>/</span>
            <span className="text-zinc-300">{product.name}</span>
          </nav>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <ProductImageZoom
              src={product.image}
              hoverImage={product.hoverImage}
              galleryImages={product.galleryImages ?? []}
              alt={product.name}
            />
          </Reveal>

          <Reveal delay={80}>
            <div className="flex h-full flex-col">
              {badgeLabel ? (
                <span className="mb-4 inline-flex w-fit rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                  {badgeLabel}
                </span>
              ) : null}

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-end gap-3">
                <span className="text-3xl font-bold text-white">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount ? (
                  <>
                    <span className="pb-1 text-lg text-zinc-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-2.5 py-1 text-xs font-bold text-white">
                      -{discountPercent}%
                    </span>
                  </>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span
                  className={[
                    "rounded-full px-3 py-1 font-medium",
                    inStock
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border border-red-500/20 bg-red-500/10 text-red-300",
                  ].join(" ")}
                >
                  {inStock ? `${product.stock} in stock` : "Out of stock"}
                </span>
                {lowStock ? (
                  <span className="text-zinc-400">Hurry — only a few left!</span>
                ) : null}
                {product.category ? (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-zinc-400">
                    {product.category}
                  </span>
                ) : null}
                <span
                  className={[
                    "rounded-full px-3 py-1 font-medium",
                    deliveryIsFree
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border border-amber-500/20 bg-amber-500/10 text-amber-200",
                  ].join(" ")}
                >
                  Delivery: {deliveryLabel}
                </span>
              </div>

              <p className="mt-6 text-base leading-8 text-zinc-400">
                {product.description}
              </p>

              <div className="mt-8 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Quantity
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center rounded-2xl border border-white/10 bg-black/30">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={!inStock || quantity <= 1}
                      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-l-2xl text-white transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-12 text-center text-base font-semibold text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={!inStock || quantity >= product.stock}
                      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-r-2xl text-white transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {isInCart ? (
                    <Link
                      href="/cart"
                      className="inline-flex min-w-[220px] flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-6 py-3.5 text-sm font-semibold text-emerald-200 transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/15 sm:flex-none"
                    >
                      Proceed to Cart ({cartItem.quantity} in cart)
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!inStock}
                      className="inline-flex min-w-[220px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_32px_rgba(139,92,246,0.35)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  "Cash on delivery available",
                  "Secure packaging",
                  deliveryIsFree ? "Free delivery on this item" : `Delivery: ${deliveryLabel}`,
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-zinc-400"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <ProductDetailsContent detailsHtml={product.detailsHtml} />

        <ProductReviews productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}
