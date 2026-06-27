import Link from "next/link";

const gradientId = "zanvara-logo-gradient";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-3 outline-none transition-transform duration-300 hover:scale-[1.02] focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-[#FFB347]/50"
      aria-label="Zanvara home"
    >
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#FFB347] via-[#F59E0B] to-[#FFD9A6] opacity-60 blur-md transition-opacity duration-300 group-hover:opacity-90"
        />
        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,179,71,0.28),transparent_55%)]"
          />
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative h-7 w-7"
            aria-hidden="true"
          >
            <path
              d="M8 8H24L14 24H22"
              stroke={`url(#${gradientId})`}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 24L18 8"
              stroke={`url(#${gradientId})`}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
            <defs>
              <linearGradient
                id={gradientId}
                x1="8"
                y1="8"
                x2="24"
                y2="24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFD9A6" />
                <stop offset="0.5" stopColor="#FFB347" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="hidden min-w-0 flex-col sm:flex">
        <span className="bg-gradient-to-r from-[#FFFFFF] via-[#FFD9A6] to-[#FFB347] bg-clip-text text-lg font-semibold tracking-tight text-transparent">
          Zanvara
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#6B6B6B] transition-colors duration-300 group-hover:text-[#A3A3A3]">
          Modern Commerce
        </span>
      </div>
    </Link>
  );
}
