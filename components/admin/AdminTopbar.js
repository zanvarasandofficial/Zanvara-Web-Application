"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSidebarToggle } from "./AdminSidebar";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { adminFetch } from "../../lib/api/admin-client";

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

function formatNotificationTitle(item) {
  if (item.type === "NEWSLETTER") {
    return `Newsletter signup: ${item.email}`;
  }

  const name = [item.firstName, item.lastName].filter(Boolean).join(" ").trim();
  return name ? `New contact from ${name}` : `New contact from ${item.email}`;
}

function formatNotificationBody(item) {
  if (item.type === "NEWSLETTER") {
    return "A visitor subscribed from the footer.";
  }

  return item.message?.trim() || "No message provided.";
}

function formatTime(value) {
  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminTopbar({ onOpenSidebar }) {
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const unreadCount = notifications.filter((item) => item.status === "NEW").length;

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      setLoadingNotifications(true);

      try {
        const data = await adminFetch("/admin/inbound");

        if (active) {
          setNotifications(Array.isArray(data) ? data.slice(0, 8) : []);
        }
      } catch {
        if (active) {
          setNotifications([]);
        }
      } finally {
        if (active) {
          setLoadingNotifications(false);
        }
      }
    }

    loadNotifications();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!notificationsOpen) return undefined;

    function handlePointerDown(event) {
      if (
        popupRef.current?.contains(event.target) ||
        buttonRef.current?.contains(event.target)
      ) {
        return;
      }

      setNotificationsOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notificationsOpen]);

  function handleLogout() {
    logout();
    router.replace("/dashboard/admin/login");
  }

  async function markAsRead(id) {
    try {
      const updated = await adminFetch(`/admin/inbound/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" }),
      });

      setNotifications((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
    } catch {
      // Ignore mark-as-read failures in the popup.
    }
  }

  async function handleNotificationClick(item) {
    if (item.status === "NEW") {
      await markAsRead(item.id);
    }

    setNotificationsOpen(false);
    router.push("/dashboard/admin/messages");
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

      <div className="flex items-center justify-end gap-3">
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:text-violet-700"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M12 5C9.2 5 7 7.2 7 10V15L5 17V18H19V17L17 15V10C17 7.2 14.8 5 12 5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M10 18C10.2 19.1 11 20 12 20C13 20 13.8 19.1 14 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            {unreadCount > 0 ? (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            ) : null}
          </button>

          {notificationsOpen ? (
            <div
              ref={popupRef}
              className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
            >
              <div className="border-b border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                    <p className="text-xs text-slate-500">
                      {unreadCount > 0
                        ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                        : "You are all caught up"}
                    </p>
                  </div>
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
                      {unreadCount} new
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loadingNotifications ? (
                  <p className="px-4 py-6 text-sm text-slate-500">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-slate-500">No notifications yet.</p>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNotificationClick(item)}
                      className="flex w-full cursor-pointer items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <span
                        className={[
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          item.status === "NEW" ? "bg-violet-500" : "bg-transparent",
                        ].join(" ")}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-slate-900">
                          {formatNotificationTitle(item)}
                        </span>
                        <span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-500">
                          {formatNotificationBody(item)}
                        </span>
                        <span className="mt-1 block text-[11px] text-slate-400">
                          {formatTime(item.createdAt)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 px-4 py-3">
                <Link
                  href="/dashboard/admin/messages"
                  onClick={() => setNotificationsOpen(false)}
                  className="inline-flex cursor-pointer text-sm font-semibold text-violet-700 transition hover:text-violet-900"
                >
                  View all messages
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs font-bold text-white">
            {getInitials(user)}
          </div>
          <div className="hidden pr-1 sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-slate-500">{user?.email ?? "—"}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
