export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Product pagination"
      className={`flex items-center justify-end gap-2 ${className}`}
    >
      <p className="mr-2 hidden text-sm text-zinc-500 sm:block">
        Page {currentPage} of {totalPages}
      </p>

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        aria-label="Previous page"
        className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-[#FFB347]/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/10 disabled:hover:text-zinc-300"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:mr-1" aria-hidden="true">
          <path
            d="M15 6L9 12L15 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="hidden sm:inline">Prev</span>
      </button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300",
                isActive
                  ? "border-[#FFB347]/40 bg-[#FFB347]/15 text-white shadow-[0_0_20px_rgba(255,179,71,0.2)]"
                  : "border-white/10 bg-white/[0.04] text-zinc-400 hover:border-[#FFB347]/30 hover:text-white",
              ].join(" ")}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Next page"
        className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-[#FFB347]/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/10 disabled:hover:text-zinc-300"
      >
        <span className="hidden sm:inline">Next</span>
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:ml-1" aria-hidden="true">
          <path
            d="M9 6L15 12L9 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}
