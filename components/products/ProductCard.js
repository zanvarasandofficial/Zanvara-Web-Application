"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import {
  formatProductOriginalPrice,
  formatProductPrice,
  getProductDisplayDiscountPercent,
} from "../../lib/money/product-price";
import { useCurrency } from "../../context/CurrencyContext";
import { PRODUCT_CARD_IMAGE_ASPECT } from "../../lib/ui/product-card-layout";
import { isComingSoonCountdownActive, isComingSoonPurchaseBlocked } from "../../lib/products/availability";
import {
  formatExpectedShip,
  getPreOrderSlotsRemaining,
  isPreOrderActive,
} from "../../lib/products/fulfillment";
import { getProductPath } from "../../lib/products/paths";
import {
  PRE_ORDER_BUTTON,
  PRE_ORDER_FULL,
  PRE_ORDER_SLOTS_LEFT,
} from "../../lib/content/pre-order";
import ComingSoonCountdown from "./ComingSoonCountdown";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  useCurrency();

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent =
    getProductDisplayDiscountPercent(product) ??
    (hasDiscount
      ? product.discountPercent ??
        Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100,
        )
      : null);
  const hoverImage = product.hoverImage || product.image;
  const productHref = getProductPath(product);
  const badgeLabel = product.badge?.trim();
  const comingSoonBlocked = isComingSoonPurchaseBlocked(product);
  const showCountdown = isComingSoonCountdownActive(product);
  const preOrderActive = isPreOrderActive(product);
  const preOrderSlots = preOrderActive ? getPreOrderSlotsRemaining(product) : 0;
  const expectedShip = preOrderActive ? formatExpectedShip(product) : null;
  const purchaseBlocked = comingSoonBlocked || (preOrderActive && preOrderSlots <= 0);

  const displayOriginalLabel = formatProductOriginalPrice(product);
  const displayDiscountPercent = getProductDisplayDiscountPercent(product);
  const showDisplayDiscount =
    displayOriginalLabel != null && displayDiscountPercent != null;

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    if (comingSoonBlocked) {
      showToast("This table is coming soon — available after the launch.", "error");
      return;
    }

    if (preOrderActive && preOrderSlots <= 0) {
      showToast(PRE_ORDER_FULL, "error");
      return;
    }

    const result = addItem(product, 1);
    if (result.ok) {
      showToast(`${product.name} added to cart`);
    } else {
      showToast(result.message, "error");
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-[#FFB347]/35 hover:shadow-[0_24px_60px_rgba(255,179,71,0.1)]">
      <Link
        href={productHref}
        className={`relative block ${PRODUCT_CARD_IMAGE_ASPECT} overflow-hidden bg-zinc-900`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
        />
        <Image
          src={hoverImage}
          alt={`${product.name} alternate view`}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
        />

        {comingSoonBlocked ? (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-violet-400/35 bg-violet-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-200 backdrop-blur-md">
            Coming soon
          </span>
        ) : badgeLabel ? (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-[#FFB347]/30 bg-[#FFB347]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFD9A6] backdrop-blur-md">
            {badgeLabel}
          </span>
        ) : null}

        {preOrderActive && !comingSoonBlocked ? (
          <span className="absolute right-4 top-4 z-10 rounded-full border border-amber-400/35 bg-amber-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100 backdrop-blur-md">
            Pre-order
          </span>
        ) : null}

        {discountPercent ? (
          <span
            className={[
              "absolute z-10 rounded-full bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-2.5 py-1 text-[11px] font-bold text-[#0A0A0A] shadow-lg shadow-[#FFB347]/30",
              preOrderActive && !comingSoonBlocked ? "right-4 top-12" : "right-4 top-4",
            ].join(" ")}
          >
            -{discountPercent}%
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={productHref}>
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#FFD9A6]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <span className="text-xl font-bold text-white">
            {formatProductPrice(product)}
          </span>
          {showDisplayDiscount ? (
            <span className="pb-0.5 text-sm text-[#6B6B6B] line-through">
              {displayOriginalLabel}
            </span>
          ) : null}
        </div>

        {preOrderActive && !comingSoonBlocked ? (
          <div className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5 text-xs leading-5 text-amber-100/90">
            {expectedShip ? (
              <p>
                Est. ship: <span className="font-semibold text-white">{expectedShip}</span>
              </p>
            ) : null}
            <p className={expectedShip ? "mt-1" : ""}>
              {preOrderSlots > 0 ? PRE_ORDER_SLOTS_LEFT(preOrderSlots) : PRE_ORDER_FULL}
            </p>
          </div>
        ) : null}

        {showCountdown ? (
          <div className="mt-3 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-200/90">
              Launch countdown
            </p>
            <ComingSoonCountdown product={product} compact className="mt-1" />
          </div>
        ) : comingSoonBlocked ? (
          <p className="mt-3 text-xs font-medium text-violet-200/90">Coming soon — not open for orders yet</p>
        ) : null}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={purchaseBlocked}
          className="group/btn relative mt-4 w-full cursor-pointer overflow-hidden rounded-2xl border border-[#FFB347]/35 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#FFB347] transition-all duration-300 hover:border-[#FFB347] hover:shadow-[0_0_24px_rgba(255,179,71,0.2)] disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500 disabled:hover:shadow-none"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-y-full bg-gradient-to-r from-[#FFB347] to-[#F59E0B] transition-transform duration-300 group-hover/btn:translate-y-0"
          />
          <span className="relative flex items-center justify-center gap-2 transition-colors duration-300 group-hover/btn:text-[#0A0A0A]">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M6 6H21L19 14H8L6 6Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L5 3H2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {comingSoonBlocked
              ? "Coming soon"
              : preOrderActive
                ? preOrderSlots <= 0
                  ? PRE_ORDER_FULL
                  : PRE_ORDER_BUTTON
                : "Add to Cart"}
          </span>
        </button>
      </div>
    </article>
  );
}
