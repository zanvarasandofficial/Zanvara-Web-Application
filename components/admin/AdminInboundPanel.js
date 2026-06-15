"use client";

import { useEffect, useMemo, useState } from "react";
import AdminPageHeader from "./AdminPageHeader";
import StatusBadge from "./StatusBadge";
import { adminFetch } from "../../lib/api/admin-client";
import { adminCardClassName } from "../../lib/ui/adminStyles";

const filters = [
  { value: "ALL", label: "All" },
  { value: "CONTACT", label: "Contact" },
  { value: "NEWSLETTER", label: "Newsletter" },
];

function formatType(type) {
  if (type === "NEWSLETTER") return "Newsletter";
  if (type === "CONTACT") return "Contact";
  return type;
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminInboundPanel() {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSubmissions() {
      setLoading(true);
      setError("");

      try {
        const data = await adminFetch("/admin/inbound");

        if (active) {
          setSubmissions(data);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message ?? "Could not load messages.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSubmissions();

    return () => {
      active = false;
    };
  }, []);

  const filteredSubmissions = useMemo(() => {
    if (filter === "ALL") return submissions;
    return submissions.filter((item) => item.type === filter);
  }, [submissions, filter]);

  const counts = useMemo(() => {
    return {
      contact: submissions.filter((item) => item.type === "CONTACT").length,
      newsletter: submissions.filter((item) => item.type === "NEWSLETTER").length,
      unread: submissions.filter((item) => item.status === "NEW").length,
    };
  }, [submissions]);

  async function markAsRead(id) {
    setUpdatingId(id);
    setError("");

    try {
      const updated = await adminFetch(`/admin/inbound/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" }),
      });

      setSubmissions((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
    } catch (updateError) {
      setError(updateError.message ?? "Could not update status.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Inbox"
        title="Messages & Subscribers"
        description="Contact form submissions and footer newsletter signups from the storefront."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className={`${adminCardClassName} p-5`}>
          <p className="text-sm text-slate-500">Contact messages</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counts.contact}</p>
        </div>
        <div className={`${adminCardClassName} p-5`}>
          <p className="text-sm text-slate-500">Newsletter emails</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counts.newsletter}</p>
        </div>
        <div className={`${adminCardClassName} p-5`}>
          <p className="text-sm text-slate-500">Unread</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counts.unread}</p>
        </div>
      </div>

      <section className={`${adminCardClassName} mt-8 overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">All submissions</h2>
            <p className="text-sm text-slate-500">
              {loading
                ? "Loading..."
                : `${filteredSubmissions.length} record${filteredSubmissions.length === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={[
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  filter === item.value
                    ? "bg-violet-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Name / Email</th>
                <th className="px-6 py-3 font-semibold">Phone</th>
                <th className="px-6 py-3 font-semibold">Message</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    No submissions yet.
                  </td>
                </tr>
              ) : null}

              {filteredSubmissions.map((item) => {
                const fullName = [item.firstName, item.lastName].filter(Boolean).join(" ");

                return (
                  <tr key={item.id} className="border-t border-slate-100 align-top">
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={formatType(item.type)}
                        tone={item.type === "NEWSLETTER" ? "violet" : "info"}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {fullName ? <p className="font-medium text-slate-900">{fullName}</p> : null}
                      <p className={fullName ? "text-xs text-slate-500" : "font-medium text-slate-900"}>
                        {item.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.phone || "—"}</td>
                    <td className="max-w-xs px-6 py-4 text-slate-600">
                      {item.message ? (
                        <p className="line-clamp-3 whitespace-pre-wrap">{item.message}</p>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={item.status === "NEW" ? "New" : "Read"}
                        tone={item.status === "NEW" ? "warning" : "success"}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {item.status === "NEW" ? (
                        <button
                          type="button"
                          disabled={updatingId === item.id}
                          onClick={() => markAsRead(item.id)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"
                        >
                          {updatingId === item.id ? "Saving..." : "Mark read"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Done</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
