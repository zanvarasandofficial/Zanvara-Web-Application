"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import {
  formatProductOriginalPrice,
  formatProductPrice,
  getProductDisplayDiscountPercent,
} from "../../lib/money/product-price";
import { formatDeliveryLabel, formatProductDeliveryTrustLine } from "../../lib/products/delivery";
import {
  PRODUCT_TRUST_COD_LINE,
  PRODUCT_TRUST_PACKAGING,
} from "../../lib/content/store-policy";
import {
  PRODUCT_TRUST_ONLINE_LINE,
} from "../../lib/payments/checkout";
import { useStorePolicy } from "../../context/StorePolicyContext";
import { useCurrency } from "../../context/CurrencyContext";
import {
  formatLaunchDateTime,
  isComingSoonCountdownActive,
  isComingSoonPurchaseBlocked,
} from "../../lib/products/availability";
import {
  formatExpectedShip,
  getPreOrderSlotsRemaining,
  getPurchasableQuantity,
  isPreOrderActive,
} from "../../lib/products/fulfillment";
import { registerCatalogProduct } from "../../lib/products/live-catalog";
import {
  PRE_ORDER_BUTTON,
  PRE_ORDER_PRODUCT_NOTE,
  PRE_ORDER_SLOTS_LEFT,
} from "../../lib/content/pre-order";
import ComingSoonCountdown from "./ComingSoonCountdown";
import ProductImageZoom from "./ProductImageZoom";
import Reveal from "../ui/Reveal";
import ProductDetailsContent from "./ProductDetailsContent";
import ProductInfoAccordion from "./ProductInfoAccordion";
import ProductReviews from "./ProductReviews";

export default function ProductDetail({ product }) {
  const { addItem, items } = useCart();
  const { showToast } = useToast();
  const { buyTwoFreeDelivery, freeDeliveryMinTableQuantity } = useStorePolicy();
  const { isPakistanVisitor } = useCurrency();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    registerCatalogProduct(product);
  }, [product]);

  const cartItem = items.find((item) => item.productId === product.id);
  const isInCart = Boolean(cartItem);

  const displayOriginalLabel = formatProductOriginalPrice(product);
  const displayDiscountPercent = getProductDisplayDiscountPercent(product);
  const showDisplayDiscount =
    displayOriginalLabel != null && displayDiscountPercent != null;
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const badgeLabel = product.badge?.trim();
  const deliveryLabel = formatDeliveryLabel(product);
  const deliveryIsFree = deliveryLabel === "Free";
  const comingSoonBlocked = isComingSoonPurchaseBlocked(product);
  const showCountdown = isComingSoonCountdownActive(product);
  const preOrderActive = isPreOrderActive(product);
  const preOrderSlots = preOrderActive ? getPreOrderSlotsRemaining(product) : 0;
  const maxPurchaseQty = getPurchasableQuantity(product);
  const expectedShip = preOrderActive ? formatExpectedShip(product) : null;
  const launchLabel = formatLaunchDateTime(product);
  const canPurchase = maxPurchaseQty > 0 && !comingSoonBlocked;
  const showInStock = !preOrderActive && !comingSoonBlocked;

  function handleAddToCart() {
    if (comingSoonBlocked) {
      showToast("This table is coming soon — available after the launch.", "error");
      return;
    }

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
    setQuantity((current) => Math.min(maxPurchaseQty, current + 1));
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

        <div className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="min-w-0">
            <ProductImageZoom
              src={product.image}
              hoverImage={product.hoverImage}
              galleryImages={product.galleryImages ?? []}
              alt={product.name}
            />
          </Reveal>

          <Reveal delay={80} className="min-w-0">
            <div className="flex h-full flex-col">
              {badgeLabel ? (
                <span className="mb-4 inline-flex w-fit rounded-full border border-[#FFB347]/25 bg-[#FFB347]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FFD9A6]">
                  {badgeLabel}
                </span>
              ) : null}

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-end gap-3">
                <span className="text-3xl font-bold text-white">
                  {formatProductPrice(product)}
                </span>
                {showDisplayDiscount ? (
                  <>
                    <span className="pb-1 text-lg text-zinc-500 line-through">
                      {displayOriginalLabel}
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-2.5 py-1 text-xs font-bold text-[#0A0A0A]">
                      -{displayDiscountPercent}%
                    </span>
                  </>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span
                  className={[
                    "rounded-full px-3 py-1 font-medium",
                    comingSoonBlocked
                      ? "border border-violet-500/25 bg-violet-500/10 text-violet-200"
                      : inStock
                        ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        : "border border-red-500/20 bg-red-500/10 text-red-300",
                  ].join(" ")}
                >
                  {comingSoonBlocked
                    ? "Coming soon"
                    : preOrderActive
                      ? "Pre-order open"
                      : inStock
                        ? `${product.stock} in stock`
                        : "Out of stock"}
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
                <p className="w-full text-xs leading-5 text-zinc-500">
                  {buyTwoFreeDelivery}
                </p>
              </div>

              <p className="mt-6 text-base leading-8 text-zinc-400">
                {product.description}
              </p>

              {comingSoonBlocked ? (
                <div className="mt-6 rounded-[1.75rem] border border-violet-500/25 bg-violet-500/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/90">
                    Coming soon
                  </p>
                  {launchLabel ? (
                    <p className="mt-2 text-sm text-zinc-400">
                      Launch target: <span className="text-white">{launchLabel}</span>
                    </p>
                  ) : null}
                  {showCountdown ? (
                    <ComingSoonCountdown product={product} className="mt-4" />
                  ) : null}
                  <p className="mt-4 text-sm leading-6 text-zinc-400">
                    Orders open automatically when the countdown reaches zero (if stock is
                    available).
                  </p>
                </div>
              ) : null}

              {preOrderActive && !comingSoonBlocked ? (
                <div className="mt-6 rounded-[1.75rem] border border-amber-500/25 bg-amber-500/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/90">
                    Pre-order
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{PRE_ORDER_PRODUCT_NOTE}</p>
                  {expectedShip ? (
                    <p className="mt-3 text-sm text-zinc-400">
                      Estimated ship:{" "}
                      <span className="font-semibold text-white">{expectedShip}</span>
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm font-medium text-amber-100">
                    {PRE_ORDER_SLOTS_LEFT(preOrderSlots)}
                  </p>
                </div>
              ) : null}

              <div className="mt-8 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Quantity
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center rounded-2xl border border-white/10 bg-black/30">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={comingSoonBlocked || !canPurchase || quantity <= 1}
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
                      disabled={comingSoonBlocked || !canPurchase || quantity >= maxPurchaseQty}
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
                      disabled={comingSoonBlocked || !canPurchase || (showInStock && !inStock)}
                      className="inline-flex min-w-[220px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,179,71,0.35)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                    >
                      {preOrderActive && !comingSoonBlocked
                        ? PRE_ORDER_BUTTON
                        : "Add to Cart"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  isPakistanVisitor ? PRODUCT_TRUST_COD_LINE : PRODUCT_TRUST_ONLINE_LINE,
                  PRODUCT_TRUST_PACKAGING,
                  formatProductDeliveryTrustLine(product, freeDeliveryMinTableQuantity),
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-zinc-400"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <ProductInfoAccordion product={product} />
            </div>
          </Reveal>
        </div>

        <ProductDetailsContent detailsHtml={product.detailsHtml} />

        <ProductReviews productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}
