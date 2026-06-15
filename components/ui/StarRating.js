export default function StarRating({ rating, max = 5, size = "md", showValue = false }) {
  const sizeClassName =
    size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${max} stars`}>
        {Array.from({ length: max }, (_, index) => {
          const filled = index < Math.floor(rating);
          const partial = !filled && index < rating;

          return (
            <svg
              key={index}
              viewBox="0 0 24 24"
              className={[
                sizeClassName,
                filled || partial ? "text-amber-400" : "text-zinc-600",
              ].join(" ")}
              fill="currentColor"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          );
        })}
      </div>
      {showValue ? (
        <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
      ) : null}
    </div>
  );
}
