"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "../brand/Logo";
import CartIcon from "../icons/CartIcon";
import UserIcon from "../icons/UserIcon";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ isLoggedIn = false }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 48);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isTransparent = isHome && !scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-[100] w-full">
      {!isTransparent ? (
        <>
          <div className="absolute inset-0 border-b border-white/[0.06] bg-[#050505]/70 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </>
      ) : null}

      <div className="relative mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 md:flex"
          aria-label="Main navigation"
        >
          <ul className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={[
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                      isActive
                        ? "border border-white/[0.08] bg-white/[0.08] text-white shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
                        : "border border-transparent bg-transparent text-zinc-400 hover:text-white",
                    ].join(" ")}
                  >
                    {link.label}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-violet-400/80 to-transparent"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <button
              type="button"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-violet-500/40 hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              aria-label="Open profile"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <UserIcon className="relative h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.07] hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              aria-label="Open cart"
            >
              <CartIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 px-1 text-[10px] font-semibold text-white shadow-lg shadow-violet-500/30">
                0
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
