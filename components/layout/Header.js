"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import Logo from "../brand/Logo";
import CartIcon from "../icons/CartIcon";
import UserIcon from "../icons/UserIcon";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const iconBtnClass =
  "group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A]/80 text-[#E5E5E5] backdrop-blur-md transition-all duration-300 hover:border-[#FFB347]/40 hover:bg-[#111111] hover:text-[#FFD9A6] hover:shadow-[0_0_24px_rgba(255,179,71,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB347]/50";

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { isAuthenticated } = useCustomerAuth();
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
          <div className="absolute inset-0 border-b border-[#2A2A2A]/80 bg-[#0A0A0A]/55 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 supports-[backdrop-filter]:bg-[#0A0A0A]/45" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FFB347]/35 to-transparent" />
        </>
      ) : null}

      <div className="relative mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 md:flex"
          aria-label="Main navigation"
        >
          <ul className="flex items-center gap-1 lg:gap-2">
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
                      "group relative px-3.5 py-2 text-sm transition-colors duration-300 lg:px-4",
                      isActive
                        ? "font-semibold text-[#FFB347]"
                        : "font-medium text-[#A3A3A3] hover:text-[#E5E5E5]",
                    ].join(" ")}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#FFB347] transition-all duration-300",
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-30",
                      ].join(" ")}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/cart" className={iconBtnClass} aria-label="Open cart">
            <CartIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            {itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB347] to-[#F59E0B] px-1 text-[10px] font-semibold text-[#0A0A0A] shadow-lg shadow-[#FFB347]/30">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>

          {isAuthenticated ? (
            <Link href="/account/profile" className={iconBtnClass} aria-label="Open profile">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFB347]/20 to-[#F59E0B]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <UserIcon className="relative h-5 w-5" />
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
