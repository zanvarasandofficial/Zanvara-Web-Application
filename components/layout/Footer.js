"use client";

import Link from "next/link";
import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { subscribeNewsletter } from "../../lib/api/inbound";
import Logo from "../brand/Logo";
import Reveal from "../ui/Reveal";
import FooterContactIcons from "../ui/FooterContactIcons";
import FooterVideoBackground from "./FooterVideoBackground";

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
  ],
};

function FooterLinkColumn({ title, links, delay, className = "" }) {
  return (
    <Reveal delay={delay}>
      <div className={className}>
        <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
        <ul className="space-y-2.5">
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

function FooterLinksGrid() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:col-span-5">
      <FooterLinkColumn title="Shop" links={footerLinks.shop} delay={80} />
      <FooterLinkColumn title="Company" links={footerLinks.company} delay={120} />
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { showToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleNewsletterSubmit(event) {
    event.preventDefault();

    if (!newsletterEmail.trim()) {
      showToast("Please enter your email.", "error");
      return;
    }

    setSaving(true);

    try {
      const result = await subscribeNewsletter(newsletterEmail.trim());
      setSubscribed(true);
      setNewsletterEmail("");
      showToast(result.message ?? "Subscribed successfully.");
    } catch (submitError) {
      showToast(submitError.message ?? "Could not subscribe.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <footer className="relative mt-auto overflow-hidden">
      <FooterVideoBackground />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent"
      />

      <div className="relative z-10 border-t border-white/[0.08] bg-[#050505]/55 backdrop-blur-[6px]">
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20 pb-6 lg:pb-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4" delay={0}>
              <Logo />
              <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
                Curated products. Premium experience. Zanvara brings modern
                commerce to your screen with style, speed, and trust.
              </p>
              <FooterContactIcons className="mt-6" />
            </Reveal>

            <FooterLinksGrid />

            <Reveal className="lg:col-span-3 lg:flex lg:items-start lg:justify-end" delay={260}>
              <form className="w-full max-w-sm space-y-3" onSubmit={handleNewsletterSubmit}>
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="you@example.com"
                  disabled={subscribed}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-600 focus:border-violet-500/40 focus:bg-black/60 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.12)] disabled:opacity-60"
                />
                {subscribed ? (
                  <p className="text-sm text-emerald-300">You are subscribed. Thank you!</p>
                ) : (
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Subscribing..." : "Subscribe"}
                  </button>
                )}
              </form>
            </Reveal>
          </div>

          <Reveal delay={320}>
            <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-500">
                © {year} Zanvara. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <Link
                  href="/terms"
                  className="text-zinc-500 transition-colors duration-300 hover:text-zinc-200"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="text-zinc-500 transition-colors duration-300 hover:text-zinc-200"
                >
                  Privacy
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
