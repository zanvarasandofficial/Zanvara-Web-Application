"use client";

import { useEffect, useMemo, useState } from "react";
import AdminPageHeader from "./AdminPageHeader";
import StatusBadge from "./StatusBadge";
import { adminFetch } from "../../lib/api/admin-client";
import {
  adminCardClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "../../lib/ui/adminStyles";

const providerFilters = [
  { value: "ALL", label: "All users" },
  { value: "EMAIL", label: "Email OTP" },
  { value: "GOOGLE", label: "Google" },
];

function formatProvider(provider) {
  if (provider === "GOOGLE") return "Google";
  if (provider === "EMAIL") return "Email OTP";
  return provider || "Unknown";
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminCustomersPanel({
  compact = false,
  title = "Registered customers",
  description = "Checkout se sign in hone wale users — email OTP ya Google se.",
}) {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promotingId, setPromotingId] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const data = await adminFetch("/admin/users");
      setUsers(data);
    } catch (loadError) {
      setError(loadError.message ?? "Could not load customers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleGrantAdmin(userId) {
    setPromotingId(userId);

    try {
      await adminFetch(`/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "ADMIN" }),
      });
      await loadUsers();
    } catch (grantError) {
      setError(grantError.message ?? "Could not grant admin access.");
    } finally {
      setPromotingId("");
    }
  }

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesFilter = filter === "ALL" || user.authProvider === filter;
      const matchesSearch =
        !query ||
        user.email.toLowerCase().includes(query) ||
        (user.name ?? "").toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [users, filter, search]);

  const counts = useMemo(
    () => ({
      total: users.length,
      email: users.filter((user) => user.authProvider === "EMAIL").length,
      google: users.filter((user) => user.authProvider === "GOOGLE").length,
    }),
    [users],
  );

  const visibleUsers = compact ? filteredUsers.slice(0, 8) : filteredUsers;

  return (
    <>
      {!compact ? (
        <AdminPageHeader
          eyebrow="Customers"
          title="Customers"
          description={description}
        />
      ) : null}

      <section className={`${adminCardClassName} ${compact ? "" : "mt-8"} overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">
              {counts.total} users · {counts.email} email · {counts.google} Google
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {providerFilters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={[
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    filter === item.value
                      ? "bg-[#FFB347] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {!compact ? (
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email..."
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#FFB347] focus:bg-white focus:ring-4 focus:ring-[#FFB347]/20"
              />
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="border-b border-rose-100 bg-rose-50 px-6 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Sign-in method</th>
                <th className="px-6 py-3 font-semibold">Email verified</th>
                <th className="px-6 py-3 font-semibold">Joined</th>
                {!compact ? <th className="px-6 py-3 font-semibold">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={compact ? 4 : 5} className="px-6 py-8 text-center text-slate-500">
                    Loading customers...
                  </td>
                </tr>
              ) : visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan={compact ? 4 : 5} className="px-6 py-8 text-center text-slate-500">
                    No customers found yet.
                  </td>
                </tr>
              ) : (
                visibleUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{user.name || "No name"}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={formatProvider(user.authProvider)}
                        tone={user.authProvider === "GOOGLE" ? "violet" : "info"}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={user.emailVerified ? "Verified" : "Pending"}
                        tone={user.emailVerified ? "success" : "warning"}
                      />
                    </td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                    {!compact ? (
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          disabled={promotingId === user.id}
                          onClick={() => handleGrantAdmin(user.id)}
                          className={adminSecondaryButtonClassName}
                        >
                          {promotingId === user.id ? "Saving..." : "Make admin"}
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {compact ? (
          <div className="border-t border-slate-200 px-6 py-4">
            <a
              href="/dashboard/admin/customers"
              className="text-sm font-semibold text-[#F59E0B] transition hover:text-[#F59E0B]"
            >
              View all customers
            </a>
          </div>
        ) : null}
      </section>
    </>
  );
}
