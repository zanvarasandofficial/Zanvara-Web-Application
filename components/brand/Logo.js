import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-3 outline-none transition-transform duration-300 hover:scale-[1.02] focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-accent/50"
      aria-label="Zanvara home"
    >
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 opacity-60 blur-md transition-opacity duration-300 group-hover:opacity-90"
        />
        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.35),transparent_55%)]"
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
              stroke="url(#zanvara-logo-gradient)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 24L18 8"
              stroke="url(#zanvara-logo-gradient)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
            <defs>
              <linearGradient
                id="zanvara-logo-gradient"
                x1="8"
                y1="8"
                x2="24"
                y2="24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#C4B5FD" />
                <stop offset="0.5" stopColor="#E879F9" />
                <stop offset="1" stopColor="#67E8F9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="hidden min-w-0 flex-col sm:flex">
        <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-lg font-semibold tracking-tight text-transparent">
          Zanvara
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
          Modern Commerce
        </span>
      </div>
    </Link>
  );
}
