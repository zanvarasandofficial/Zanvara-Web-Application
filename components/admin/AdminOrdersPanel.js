"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import { formatPrice } from "../../lib/data/products";
import {
  ORDER_STATUS,
  formatOrderForAdmin,
  readOrderHistory,
  updateOrderStatus,
} from "../../lib/orders/order-storage";
import {
  adminCardClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
  adminSelectClassName,
} from "../../lib/ui/adminStyles";

const statusFilters = ["ALL", ...Object.values(ORDER_STATUS)];

export default function AdminOrdersPanel({ compact = false, title = "All orders" }) {
  const [orders, setOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  function loadOrders() {
    const history = readOrderHistory().map(formatOrderForAdmin);
    setOrders(history);
    setStatusMap(Object.fromEntries(history.map((order) => [order.id, order.status])));
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const visibleOrders = compact ? filteredOrders.slice(0, 5) : filteredOrders;

  function handleSave(orderId) {
    const nextStatus = statusMap[orderId];
    if (!nextStatus) return;
    updateOrderStatus(orderId, nextStatus);
    loadOrders();
  }

  return (
    <section className={`${adminCardClassName} ${compact ? "" : "mt-8"} overflow-hidden`}>
      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">
            {orders.length} checkout order{orders.length === 1 ? "" : "s"}
            {compact ? "" : ` · showing ${filteredOrders.length}`}
          </p>
        </div>

        {!compact ? (
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={adminSelectClassName}
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All statuses" : status}
                </option>
              ))}
            </select>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders..."
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Order ID</th>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Items</th>
              <th className="px-6 py-3 font-semibold">Total</th>
              <th className="px-6 py-3 font-semibold">Payment</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                  {orders.length === 0
                    ? "No checkout orders yet. Place an order from the storefront to see it here."
                    : "No orders match your search or filter."}
                </td>
              </tr>
            ) : (
              visibleOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{order.customer}</p>
                    <p className="text-xs text-slate-500">{order.email}</p>
                    {order.phone !== "—" ? (
                      <p className="text-xs text-slate-400">{order.phone}</p>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.itemCount}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.payment}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/admin/orders/${order.id}`}
                        className={adminSecondaryButtonClassName}
                      >
                        View
                      </Link>
                      {!compact ? (
                        <>
                          <select
                            value={statusMap[order.id] || order.status}
                            onChange={(event) =>
                              setStatusMap((current) => ({
                                ...current,
                                [order.id]: event.target.value,
                              }))
                            }
                            className={`${adminSelectClassName} min-w-[130px]`}
                          >
                            {Object.values(ORDER_STATUS).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleSave(order.id)}
                            className={adminPrimaryButtonClassName}
                          >
                            Save
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {compact ? (
        <div className="border-t border-slate-200 px-6 py-4">
          <Link
            href="/dashboard/admin/orders"
            className="text-sm font-semibold text-violet-600 transition hover:text-violet-700"
          >
            View all orders
          </Link>
        </div>
      ) : null}
    </section>
  );
}
