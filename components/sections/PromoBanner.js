import Link from "next/link";
import Reveal from "../ui/Reveal";

const perks = [
  {
    title: "Free Express Delivery",
    description: "Fast shipping on orders above Rs. 5,000 nationwide.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M3 7H15V17H3V7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M15 10H18L21 13V17H15V10Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
        <circle cx="18" cy="17.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description: "Encrypted checkout with trusted payment partners.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect
          x="3"
          y="6"
          width="18"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M3 10H21"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M7 15H11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy on eligible items.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M8 7H5V4M5 12C5 16.4 8.6 20 13 20C17.4 20 21 16.4 21 12C21 7.6 17.4 4 13 4H10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    description: "Our team is always ready to help you shop confidently.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M12 3C7.6 3 4 6.2 4 10.2C4 12.4 5 14.4 6.6 15.8L6 19L9.4 17.2C10.2 17.4 11.1 17.5 12 17.5C16.4 17.5 20 14.3 20 10.3C20 6.2 16.4 3 12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function PromoBanner() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-cyan-500/10 p-8 sm:p-10 lg:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-200">
                  Limited Time Offer
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Up to 40% off on selected premium products
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300">
                  Upgrade your cart with exclusive deals before the season ends.
                  Fresh drops, verified quality, and member-only savings.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:scale-[1.02]"
                >
                  Grab the Deals
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Talk to Support
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk, index) => (
            <Reveal key={perk.title} delay={index * 80}>
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.05]">
                <div className="mb-4 inline-flex rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 text-violet-300">
                  {perk.icon}
                </div>
                <h3 className="text-base font-semibold text-white">{perk.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {perk.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
