"use client";

import { useRouter } from "next/navigation";
import { AdminSidebarToggle } from "./AdminSidebar";
import { useAdminAuth } from "../../context/AdminAuthContext";

function getInitials(user) {
  if (user?.name) {
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return user?.email?.slice(0, 2).toUpperCase() ?? "AD";
}

export default function AdminTopbar({ onOpenSidebar }) {
  const router = useRouter();
  const { user, logout } = useAdminAuth();

  function handleLogout() {
    logout();
    router.replace("/dashboard/admin/login");
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <AdminSidebarToggle onOpen={onOpenSidebar} />
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-900">Admin Panel</p>
          <p className="text-xs text-slate-500">Manage your Zanvara store</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 sm:max-w-xl">
        <label className="relative hidden flex-1 sm:block">
          <span className="sr-only">Search admin</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search products, orders, customers..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:text-violet-700"
          aria-label="Notifications"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M12 5C9.2 5 7 7.2 7 10V15L5 17V18H19V17L17 15V10C17 7.2 14.8 5 12 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M10 18C10.2 19.1 11 20 12 20C13 20 13.8 19.1 14 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs font-bold text-white">
            {getInitials(user)}
          </div>
          <div className="hidden pr-1 sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-slate-500">{user?.email ?? "admin@gmail.com"}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
