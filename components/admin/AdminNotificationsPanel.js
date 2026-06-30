"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminPageHeader from "./AdminPageHeader";
import StatusBadge from "./StatusBadge";
import { adminFetch } from "../../lib/api/admin-client";
import {
  formatNotificationTime,
  formatNotificationType,
  getNotificationHref,
} from "../../lib/admin/notifications";
import { adminCardClassName } from "../../lib/ui/adminStyles";

const filters = [
  { value: "ALL", label: "All" },
  { value: "ORDER", label: "Orders" },
  { value: "LOGIN", label: "Logins" },
];

export default function AdminNotificationsPanel() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      setLoading(true);
      setError("");

      try {
        const data = await adminFetch("/admin/notifications?limit=100");

        if (active) {
          setNotifications(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message ?? "Could not load notifications.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      active = false;
    };
  }, []);

  const filteredNotifications = useMemo(() => {
    if (filter === "ALL") return notifications;
    return notifications.filter((item) => item.type === filter);
  }, [notifications, filter]);

  const counts = useMemo(() => {
    return {
      orders: notifications.filter((item) => item.type === "ORDER").length,
      logins: notifications.filter((item) => item.type === "LOGIN").length,
      unread: notifications.filter((item) => item.status === "NEW").length,
    };
  }, [notifications]);

  async function markAsRead(id) {
    setUpdatingId(id);

    try {
      const updated = await adminFetch(`/admin/notifications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" }),
      });

      setNotifications((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
    } catch {
      // Ignore mark-as-read failures.
    } finally {
      setUpdatingId("");
    }
  }

  async function handleOpen(item) {
    if (item.status === "NEW") {
      await markAsRead(item.id);
    }

    router.push(getNotificationHref(item));
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Alerts"
        title="Notifications"
        description="Order and customer login alerts. Contact form submissions stay in Messages."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className={`${adminCardClassName} p-5`}>
          <p className="text-sm text-slate-500">Order alerts</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counts.orders}</p>
        </div>
        <div className={`${adminCardClassName} p-5`}>
          <p className="text-sm text-slate-500">Login alerts</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counts.logins}</p>
        </div>
        <div className={`${adminCardClassName} p-5`}>
          <p className="text-sm text-slate-500">Unread</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counts.unread}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={[
              "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition",
              filter === item.value
                ? "bg-[#FFB347] text-[#0A0A0A]"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#FFB347]/30 hover:text-[#F59E0B]",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={`mt-6 ${adminCardClassName} p-5`}>
        {loading ? (
          <p className="text-sm text-slate-500">Loading notifications...</p>
        ) : error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="text-sm text-slate-500">No notifications yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <button
                  type="button"
                  onClick={() => handleOpen(item)}
                  className="min-w-0 flex-1 cursor-pointer text-left"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                    <StatusBadge
                      status={formatNotificationType(item.type)}
                      tone={item.type === "ORDER" ? "warning" : "info"}
                    />
                    {item.status === "NEW" ? (
                      <StatusBadge status="New" tone="danger" />
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {formatNotificationTime(item.createdAt)}
                  </p>
                </button>

                <div className="flex shrink-0 items-center gap-2">
                  {item.status === "NEW" ? (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      disabled={updatingId === item.id}
                      className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#FFB347]/30 hover:text-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Mark read
                    </button>
                  ) : null}
                  <Link
                    href={getNotificationHref(item)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-[#F59E0B] transition hover:border-[#FFB347]/30 hover:bg-[#FFB347]/10"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
