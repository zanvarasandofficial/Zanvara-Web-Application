"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminPageHeader from "./AdminPageHeader";
import OrderTrackingTimeline from "../orders/OrderTrackingTimeline";
import StatusBadge from "./StatusBadge";
import { formatPrice } from "../../lib/data/products";
import { adminFetch } from "../../lib/api/admin-client";
import { ORDER_STATUS } from "../../lib/orders/order-storage";
import { getOrderStatusLabel } from "../../lib/orders/order-status";
import {
  adminCardClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
  adminSelectClassName,
} from "../../lib/ui/adminStyles";

export default function AdminOrderDetailView({ orderId }) {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(ORDER_STATUS.PENDING);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        const data = await adminFetch(`/admin/orders/${encodeURIComponent(orderId)}`);
        if (cancelled) return;
        setOrder(data);
        setStatus(data.status);
      } catch {
        if (!cancelled) setOrder(null);
      }
    }

    loadOrder();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (order === null) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Sales"
          title="Order not found"
          description="This order could not be found."
          action={
            <Link href="/dashboard/admin/orders" className={adminSecondaryButtonClassName}>
              Back to orders
            </Link>
          }
        />
        <section className={`${adminCardClassName} mt-8 p-6`}>
          <p className="text-sm text-slate-600">
            Check the order ID or return to the orders list.
          </p>
        </section>
      </>
    );
  }

  async function handleSaveStatus() {
    setIsSaving(true);
    try {
      const updated = await adminFetch(
        `/admin/orders/${encodeURIComponent(order.id)}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      setOrder(updated);
      setStatus(updated.status);
      setSavedMessage("Status updated.");
      window.setTimeout(() => setSavedMessage(""), 2500);
    } catch {
      setSavedMessage("");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Sales"
        title={`Order ${order.id}`}
        description="Review order details, update fulfillment status, and track warehouse dispatch."
        action={
          <Link href="/dashboard/admin/orders" className={adminSecondaryButtonClassName}>
            Back to orders
          </Link>
        }
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className={`${adminCardClassName} p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Customer
                </p>
                <p className="mt-1 font-medium text-slate-900">{order.customer}</p>
                <p className="text-sm text-slate-500">{order.email}</p>
                {order.phone !== "—" ? (
                  <p className="mt-1 text-sm text-slate-500">{order.phone}</p>
                ) : null}
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Placed on
                </p>
                <p className="mt-1 font-medium text-slate-900">{order.date}</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Payment
                </p>
                <p className="mt-1 font-medium text-slate-900">{order.payment}</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Total
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>
          </section>

          <section className={`${adminCardClassName} p-6`}>
            <h2 className="text-lg font-semibold text-slate-900">Fulfillment tracking</h2>
            <p className="mt-2 text-sm text-slate-500">
              Update the status when the parcel leaves the warehouse or is delivered to the
              customer.
            </p>
            <div className="mt-5">
              <OrderTrackingTimeline status={order.status} variant="light" />
            </div>
          </section>

          <section className={`${adminCardClassName} p-6`}>
            <h2 className="text-lg font-semibold text-slate-900">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 px-4 py-3 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Address
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{order.address}</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  City
                </p>
                <p className="mt-1 font-medium text-slate-900">{order.city}</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Order notes
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {order.notes || "No notes provided"}
                </p>
              </div>
            </div>
          </section>

          <section className={`${adminCardClassName} p-6`}>
            <h2 className="text-lg font-semibold text-slate-900">Items</h2>
            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Delivery</span>
                <span>
                  {order.deliveryTotal > 0 ? formatPrice(order.deliveryTotal) : "Free"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between font-semibold text-slate-900">
                <span>Total due on delivery</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>
        </div>

        <section className={`${adminCardClassName} h-fit p-6`}>
          <h2 className="text-lg font-semibold text-slate-900">Update status</h2>
          <p className="mt-2 text-sm text-slate-500">
            Mark as <strong>Dispatched from Warehouse</strong> when the parcel leaves, and{" "}
            <strong>Delivered</strong> when the customer receives it. Reviews unlock after
            delivery.
          </p>
          <label className="mt-5 flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Order status
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={adminSelectClassName}
            >
              {Object.values(ORDER_STATUS).map((value) => (
                <option key={value} value={value}>
                  {getOrderStatusLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleSaveStatus}
            disabled={isSaving}
            className={`${adminPrimaryButtonClassName} mt-5 w-full`}
          >
            {isSaving ? "Saving..." : "Save Status"}
          </button>
          {savedMessage ? (
            <p className="mt-3 text-sm font-medium text-emerald-600">{savedMessage}</p>
          ) : null}
        </section>
      </div>
    </>
  );
}
