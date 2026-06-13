"use client";

import Link from "next/link";
import Logo from "../brand/Logo";
import Reveal from "../ui/Reveal";
import SocialLinks from "./SocialLinks";

const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/products", label: "New Arrivals" },
    { href: "/products", label: "Best Sellers" },
    { href: "/products", label: "Categories" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Blog" },
  ],
  support: [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Shipping Info" },
    { href: "#", label: "Returns" },
    { href: "#", label: "Privacy Policy" },
  ],
};

function FooterLinkColumn({ title, links, delay }) {
  return (
    <Reveal delay={delay}>
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
          {title}
        </h3>
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="group inline-flex items-center text-sm text-zinc-400 transition-colors duration-300 hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="mr-0 inline-block w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:w-2 group-hover:opacity-100"
                >
                  <span className="block h-1 w-1 rounded-full bg-violet-400" />
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl animate-footer-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl animate-footer-glow-reverse"
      />

      <div className="relative border-t border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4" delay={0}>
              <Logo />
              <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
                Curated products. Premium experience. Zanvara brings modern
                commerce to your screen with style, speed, and trust.
              </p>
              <div className="mt-6">
                <SocialLinks />
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5 lg:gap-10">
              <FooterLinkColumn title="Shop" links={footerLinks.shop} delay={80} />
              <FooterLinkColumn
                title="Company"
                links={footerLinks.company}
                delay={140}
              />
              <FooterLinkColumn
                title="Support"
                links={footerLinks.support}
                delay={200}
              />
            </div>

            <Reveal className="lg:col-span-3" delay={260}>
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/90">
                  Stay in the loop
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  Get exclusive drops
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  New arrivals, offers, and updates — straight to your inbox.
                </p>

                <form
                  className="mt-5 space-y-3"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <div className="group relative">
                    <input
                      id="footer-email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-600 focus:border-violet-500/40 focus:bg-black/60 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.12)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] px-4 py-3 text-sm font-semibold text-white transition-all duration-500 hover:bg-right hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </Reveal>
          </div>

          <Reveal delay={320}>
            <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-500">
                © {year} Zanvara. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <Link
                  href="#"
                  className="text-zinc-500 transition-colors duration-300 hover:text-zinc-200"
                >
                  Terms
                </Link>
                <Link
                  href="#"
                  className="text-zinc-500 transition-colors duration-300 hover:text-zinc-200"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-zinc-500 transition-colors duration-300 hover:text-zinc-200"
                >
                  Cookies
                </Link>
                <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:inline-block" />
                <span className="inline-flex items-center gap-2 text-zinc-500">
                  <span
                    aria-hidden="true"
                    className="relative flex h-2 w-2"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Store online
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
