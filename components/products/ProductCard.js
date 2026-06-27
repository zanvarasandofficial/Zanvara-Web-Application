"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../lib/data/products";
import { PRODUCT_CARD_IMAGE_ASPECT } from "../../lib/ui/product-card-layout";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? product.discountPercent ??
      Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;
  const hoverImage = product.hoverImage || product.image;
  const productHref = `/products/${product.id}`;
  const badgeLabel = product.badge?.trim();

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

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

        {badgeLabel ? (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-[#FFB347]/30 bg-[#FFB347]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFD9A6] backdrop-blur-md">
            {badgeLabel}
          </span>
        ) : null}

        {discountPercent ? (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-2.5 py-1 text-[11px] font-bold text-[#0A0A0A] shadow-lg shadow-[#FFB347]/30">
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
            {formatPrice(product.price)}
          </span>
          {hasDiscount ? (
            <span className="pb-0.5 text-sm text-[#6B6B6B] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="group/btn relative mt-4 w-full cursor-pointer overflow-hidden rounded-2xl border border-[#FFB347]/35 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#FFB347] transition-all duration-300 hover:border-[#FFB347] hover:shadow-[0_0_24px_rgba(255,179,71,0.2)]"
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
            Add to Cart
          </span>
        </button>
      </div>
    </article>
  );
}
