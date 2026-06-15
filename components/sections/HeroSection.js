"use client";

import Link from "next/link";
import Reveal from "../ui/Reveal";
import HeroMediaBackground from "./HeroMediaBackground";

export default function HeroSection({ hero }) {
  const mediaType = hero?.mediaType ?? "video";
  const mediaUrl = hero?.mediaUrl ?? "";

  return (
    <section className="relative min-h-[70vh] overflow-hidden sm:min-h-[78vh] lg:min-h-[85vh]">
      <HeroMediaBackground mediaType={mediaType} mediaUrl={mediaUrl} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-[calc(4.5rem+2.5rem)] sm:px-6 sm:pb-14 sm:pt-[calc(4.5rem+3.5rem)] lg:px-8 lg:pb-16 lg:pt-[calc(4.5rem+4rem)]">
        <div className="grid items-center gap-10 lg:grid-cols-1 lg:gap-14">
          <Reveal immediate className="max-w-2xl">
            <p className="mb-4 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
              Premium Collection 2026
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover products that{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                elevate your lifestyle
              </span>
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-400 sm:text-lg">
              From trending tech to everyday essentials — shop curated picks with
              fast delivery, secure checkout, and exclusive member deals.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:bg-right hover:shadow-[0_0_32px_rgba(139,92,246,0.35)]"
              >
                Shop All Products
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-violet-500/35 hover:bg-white/[0.07]"
              >
                View Best Deals
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-8">
              {[
                { value: "2K+", label: "Products" },
                { value: "50K+", label: "Happy Customers" },
                { value: "4.9", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160} className="relative" />
        </div>
      </div>
    </section>
  );
}
