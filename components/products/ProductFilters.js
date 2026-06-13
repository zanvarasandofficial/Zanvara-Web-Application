"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { productCategories } from "../../lib/data/products";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-600 focus:border-violet-500/40 focus:bg-black/60 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.12)]";

const selectClassName =
  "w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-violet-500/40 focus:bg-black/60 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.12)]";

function FieldGroup({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>
      {children}
    </div>
  );
}

function lockBodyScroll() {
  const scrollY = window.scrollY;
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  return scrollY;
}

function unlockBodyScroll(scrollY) {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
}

function FilterModal({
  open,
  onClose,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onSaleOnly,
  onSaleOnlyChange,
  inStockOnly,
  onInStockOnlyChange,
  priceBounds,
  sortOptions,
  onReset,
  onApply,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const scrollY = lockBodyScroll();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll(scrollY);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
    >
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer touch-none bg-black/80 backdrop-blur-md"
      />

      <div
        className="filter-modal-panel relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b0e] shadow-[0_40px_100px_rgba(0,0,0,0.75)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
          <div>
            <h3 id="filter-modal-title" className="text-lg font-semibold text-white">
              Filters
            </h3>
            <p className="text-sm text-zinc-500">Refine your product search</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:border-violet-500/30 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M7 7L17 17M17 7L7 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-3">
            <FieldGroup label="Category">
              <select
                value={category}
                onChange={(event) => onCategoryChange(event.target.value)}
                className={selectClassName}
              >
                <option value="all">All categories</option>
                {productCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </FieldGroup>

            <FieldGroup label="Sort by">
              <select
                value={sort}
                onChange={(event) => onSortChange(event.target.value)}
                className={selectClassName}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldGroup>

            <FieldGroup label="Price range">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                    Min
                  </span>
                  <input
                    type="number"
                    min={priceBounds.min}
                    max={maxPrice}
                    value={minPrice}
                    onChange={(event) => onMinPriceChange(Number(event.target.value))}
                    className={inputClassName}
                  />
                </label>
                <label className="flex flex-col gap-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                    Max
                  </span>
                  <input
                    type="number"
                    min={minPrice}
                    max={priceBounds.max}
                    value={maxPrice}
                    onChange={(event) => onMaxPriceChange(Number(event.target.value))}
                    className={inputClassName}
                  />
                </label>
              </div>
            </FieldGroup>

            <FieldGroup label="Quick price">
              <div className="flex flex-wrap gap-2.5">
                {[
                  { label: "Under 5K", min: priceBounds.min, max: 5000 },
                  { label: "5K – 15K", min: 5000, max: 15000 },
                  { label: "15K – 50K", min: 15000, max: 50000 },
                  { label: "50K+", min: 50000, max: priceBounds.max },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onMinPriceChange(preset.min);
                      onMaxPriceChange(preset.max);
                    }}
                    className="cursor-pointer rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-violet-500/30 hover:text-white"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Availability">
              <div className="flex flex-col gap-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(event) => onSaleOnlyChange(event.target.checked)}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-violet-500"
                  />
                  <span className="text-sm text-zinc-300">On sale only</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(event) => onInStockOnlyChange(event.target.checked)}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-violet-500"
                  />
                  <span className="text-sm text-zinc-300">In stock only</span>
                </label>
              </div>
            </FieldGroup>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-white/[0.08] bg-[#0b0b0e] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:text-white"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 cursor-pointer rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-[0_0_24px_rgba(139,92,246,0.28)]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onSaleOnly,
  onSaleOnlyChange,
  inStockOnly,
  onInStockOnlyChange,
  priceBounds,
  sortOptions,
  onReset,
  resultCount,
  activeFilterCount,
  filterOpen,
  onFilterOpen,
  onFilterClose,
}) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M16 16L20 20"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            className={`${inputClassName} pl-11`}
          />
        </div>

        <button
          type="button"
          onClick={onFilterOpen}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-violet-500/35 hover:bg-white/[0.07] sm:min-w-[130px]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M4 7H20M7 12H17M10 17H14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Filters
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-violet-500 px-2 py-0.5 text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-500">
        {resultCount} product{resultCount === 1 ? "" : "s"} found
      </p>

      <FilterModal
        open={filterOpen}
        onClose={onFilterClose}
        category={category}
        onCategoryChange={onCategoryChange}
        sort={sort}
        onSortChange={onSortChange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={onMinPriceChange}
        onMaxPriceChange={onMaxPriceChange}
        onSaleOnly={onSaleOnly}
        onSaleOnlyChange={onSaleOnlyChange}
        inStockOnly={inStockOnly}
        onInStockOnlyChange={onInStockOnlyChange}
        priceBounds={priceBounds}
        sortOptions={sortOptions}
        onReset={onReset}
        onApply={onFilterClose}
      />
    </>
  );
}

export function countActiveFilters({
  category,
  sort,
  minPrice,
  maxPrice,
  onSaleOnly,
  inStockOnly,
  priceBounds,
}) {
  let count = 0;

  if (category !== "all") count += 1;
  if (sort !== "featured") count += 1;
  if (minPrice !== priceBounds.min || maxPrice !== priceBounds.max) count += 1;
  if (onSaleOnly) count += 1;
  if (inStockOnly) count += 1;

  return count;
}
