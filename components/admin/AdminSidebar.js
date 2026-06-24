"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard/admin",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M4 10.5L12 4L20 10.5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V10.5Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 20V13H15V20" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/dashboard/admin/products",
    label: "Products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M7 7H17V17H7V7Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 10V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V10" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 7V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V7" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/orders",
    label: "Orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M7 7H17L16 17H8L7 7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7 7L6 4H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/categories",
    label: "Categories",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M4 7H20M4 12H20M4 17H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/customers",
    label: "Customers",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 20C5.8 16.7 8.6 15 12 15C15.4 15 18.2 16.7 19 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/reviews",
    label: "Reviews",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/messages",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/hero",
    label: "Hero Section",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 10H21" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 15H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 3V5M12 19V21M21 12H19M5 12H3M18.364 5.636L16.95 7.05M7.05 16.95L5.636 18.364M18.364 18.364L16.95 16.95M7.05 7.05L5.636 5.636" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

function isActivePath(pathname, href, exact = false) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  const navContent = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
          Z
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Zanvara Admin</p>
          <p className="text-xs text-slate-500">Store management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M14 4H20V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M10 14L20 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          View Storefront
        </Link>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col overflow-hidden border-r border-slate-200 bg-white lg:flex">
        {navContent}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-900/40"
            onClick={onClose}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl">
            {navContent}
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function AdminSidebarToggle({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-violet-200 hover:text-violet-700 lg:hidden"
      aria-label="Open menu"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
