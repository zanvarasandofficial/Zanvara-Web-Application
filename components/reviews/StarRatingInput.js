"use client";

export default function StarRatingInput({ value, onChange, disabled = false }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const active = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starValue)}
            className={[
              "rounded-lg p-1 transition-colors",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-white/[0.05]",
            ].join(" ")}
            aria-label={`Rate ${starValue} star${starValue === 1 ? "" : "s"}`}
          >
            <svg
              viewBox="0 0 24 24"
              className={[
                "h-7 w-7",
                active ? "text-amber-400" : "text-zinc-600",
              ].join(" ")}
              fill="currentColor"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
