import {
  PRODUCT_CARD_IMAGE_ASPECT,
  PRODUCT_SHIMMER_GRID_CLASS,
  PRODUCT_SLIDER_BREAKPOINTS,
} from "../../lib/ui/product-card-layout";

function ShimmerBlock({ className = "" }) {
  return (
    <div
      className={[
        "animate-pulse rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] bg-[length:200%_100%]",
        className,
      ].join(" ")}
    />
  );
}

export function ProductCardShimmer() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03]">
      <ShimmerBlock className={`${PRODUCT_CARD_IMAGE_ASPECT} w-full rounded-none`} />
      <div className="space-y-3 p-4">
        <ShimmerBlock className="h-4 w-3/4" />
        <ShimmerBlock className="h-4 w-1/3" />
        <ShimmerBlock className="h-10 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function ProductSliderShimmer({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardShimmer key={index} />
      ))}
    </div>
  );
}

export function ProductGridShimmer({ count = 9, className = PRODUCT_SHIMMER_GRID_CLASS }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardShimmer key={index} />
      ))}
    </div>
  );
}

export { PRODUCT_SLIDER_BREAKPOINTS };

export function CategorySliderShimmer({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03]"
        >
          <ShimmerBlock className={`${PRODUCT_CARD_IMAGE_ASPECT} w-full rounded-none`} />
        </div>
      ))}
    </div>
  );
}

export function ReviewsSliderShimmer({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6"
        >
          <ShimmerBlock className="h-4 w-24" />
          <ShimmerBlock className="mt-4 h-6 w-2/3" />
          <ShimmerBlock className="mt-3 h-16 w-full" />
          <ShimmerBlock className="mt-6 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
