"use client";

import { forwardRef } from "react";

export const SliderNavButton = forwardRef(function SliderNavButton(
  { direction = "next", className = "", ...props },
  ref,
) {
  const isPrev = direction === "prev";

  return (
    <button
      ref={ref}
      type="button"
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      className={[
        "group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/40 hover:text-white hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:shadow-none",
        className,
      ].join(" ")}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-disabled:opacity-0"
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={[
          "relative h-5 w-5 transition-transform duration-300",
          isPrev
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5",
        ].join(" ")}
        aria-hidden="true"
      >
        <path
          d={isPrev ? "M15 6L9 12L15 18" : "M9 6L15 12L9 18"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
});

export function SliderNav({ prevRef, nextRef }) {
  return (
    <div className="flex items-center gap-2.5">
      <SliderNavButton direction="prev" ref={prevRef} />
      <SliderNavButton direction="next" ref={nextRef} />
    </div>
  );
}
