"use client";

import Image from "next/image";
import { formatPrice } from "../../lib/data/products";

export default function ProductCard({ product }) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;
  const hoverImage = product.hoverImage || product.image;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-violet-500/25 hover:shadow-[0_24px_60px_rgba(139,92,246,0.15)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
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

        {product.badge ? (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-200 backdrop-blur-md">
            {product.badge}
          </span>
        ) : null}

        {discountPercent ? (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg shadow-fuchsia-500/30">
            -{discountPercent}%
          </span>
        ) : null}

        <button
          type="button"
          aria-label={`Quick view ${product.name}`}
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:border-violet-400/40 hover:bg-violet-500/20"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M12 5C7 5 2.7 8.1 1 12C2.7 15.9 7 19 12 19C17 19 21.3 15.9 23 12C21.3 8.1 17 5 12 5Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3rem] text-base font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-violet-200">
          {product.name}
        </h3>

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <span className="text-xl font-bold text-white">
            {formatPrice(product.price)}
          </span>
          {hasDiscount ? (
            <span className="pb-0.5 text-sm text-zinc-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="group/btn relative mt-5 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-violet-500/35 hover:shadow-[0_0_24px_rgba(139,92,246,0.2)]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-y-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 transition-transform duration-300 group-hover/btn:translate-y-0"
          />
          <span className="relative flex items-center justify-center gap-2">
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
