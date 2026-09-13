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
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
  adminSelectClassName,
} from "../../lib/ui/adminStyles";

function InfoRow({ label, value, multiline = false }) {
  const display = value == null || value === "" ? "—" : value;

  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd
        className={[
          "text-sm text-slate-900",
          multiline ? "whitespace-pre-wrap leading-6" : "font-medium",
        ].join(" ")}
      >
        {display}
      </dd>
    </div>
  );
}

function formatDeliveryLine(item) {
  const parts = [item.deliveryLabel ?? "Standard delivery"];
  if (item.deliveryEta) parts.push(item.deliveryEta);
  if ((item.deliveryCharge ?? 0) > 0) {
    parts.push(formatPrice(item.deliveryCharge));
  } else {
    parts.push("Free");
  }
  return parts.join(" · ");
}

function formatAdvanceNote(item) {
  const percent = Number(item.onlinePaymentPercent ?? 0);
  if (percent <= 0) return null;

  const amount = item.onlineAdvanceAmount ?? 0;
  const label = percent >= 100 ? "Full online required" : `${percent}% advance required`;

  return `${label} · ${formatPrice(amount)}`;
}

function getPaymentStatusLabel(status) {
  if (status === "received") return "Fully received";
  if (status === "partial") return "Partially received";
  if (status === "pending") return "Not received yet";
  return null;
}

function PaymentStatusPill({ status }) {
  const label = getPaymentStatusLabel(status);
  if (!label) return null;

  const styles =
    status === "received"
      ? "bg-emerald-100 text-emerald-800"
      : status === "partial"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
}

export default function AdminOrderDetailView({ orderId }) {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(ORDER_STATUS.PENDING);
  const [paymentReceived, setPaymentReceived] = useState("0");
  const [paymentNote, setPaymentNote] = useState("");
  const [balanceReceived, setBalanceReceived] = useState("0");
  const [balanceNote, setBalanceNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isSavingBalance, setIsSavingBalance] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [balanceMessage, setBalanceMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        const data = await adminFetch(`/admin/orders/${encodeURIComponent(orderId)}`);
        if (cancelled) return;
        setOrder(data);
        setStatus(data.status);
        setPaymentReceived(String(data.onlinePaymentReceived ?? 0));
        setPaymentNote(data.onlinePaymentNote ?? "");
        setBalanceReceived(String(data.balancePaymentReceived ?? 0));
        setBalanceNote(data.balancePaymentNote ?? "");
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

  async function handleSavePayment(receivedAmount) {
    setIsSavingPayment(true);
    setPaymentMessage("");

    try {
      const updated = await adminFetch(
        `/admin/orders/${encodeURIComponent(order.id)}/payment`,
        {
          method: "PATCH",
          body: JSON.stringify({
            onlinePaymentReceived: receivedAmount,
            onlinePaymentNote: paymentNote.trim() || null,
          }),
        },
      );
      setOrder(updated);
      setPaymentReceived(String(updated.onlinePaymentReceived ?? 0));
      setPaymentNote(updated.onlinePaymentNote ?? "");
      setBalanceReceived(String(updated.balancePaymentReceived ?? 0));
      setBalanceNote(updated.balancePaymentNote ?? "");
      setPaymentMessage("Online payment updated.");
      window.setTimeout(() => setPaymentMessage(""), 2500);
    } catch (error) {
      setPaymentMessage(error.message ?? "Could not save payment.");
    } finally {
      setIsSavingPayment(false);
    }
  }

  async function handleSaveBalancePayment(receivedAmount) {
    setIsSavingBalance(true);
    setBalanceMessage("");

    try {
      const updated = await adminFetch(
        `/admin/orders/${encodeURIComponent(order.id)}/payment`,
        {
          method: "PATCH",
          body: JSON.stringify({
            balancePaymentReceived: receivedAmount,
            balancePaymentNote: balanceNote.trim() || null,
          }),
        },
      );
      setOrder(updated);
      setBalanceReceived(String(updated.balancePaymentReceived ?? 0));
      setBalanceNote(updated.balancePaymentNote ?? "");
      setBalanceMessage("Delivery payment updated.");
      window.setTimeout(() => setBalanceMessage(""), 2500);
    } catch (error) {
      setBalanceMessage(error.message ?? "Could not save delivery payment.");
    } finally {
      setIsSavingBalance(false);
    }
  }

  const onlineDue = order.onlinePaymentDue ?? 0;
  const onlineReceived = order.onlinePaymentReceived ?? 0;
  const onlineRemaining = order.onlinePaymentRemaining ?? Math.max(0, onlineDue - onlineReceived);
  const advancePercent = order.onlinePaymentPercentRequired ?? 0;
  const codDue = order.balanceOnDelivery ?? order.total;
  const codReceived = order.balancePaymentReceived ?? 0;
  const codRemaining = order.balancePaymentRemaining ?? Math.max(0, codDue - codReceived);
  const fullOnline = onlineDue >= order.total;
  const requiresOnlinePayment = onlineDue > 0;
  const requiresBalancePayment = codDue > 0 && !fullOnline;

  return (
    <>
      <AdminPageHeader
        eyebrow="Sales"
        title={`Order ${order.id}`}
        description={order.createdAtDisplay ?? order.date}
        action={
          <Link href="/dashboard/admin/orders" className={adminSecondaryButtonClassName}>
            Back to orders
          </Link>
        }
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <section className={`${adminCardClassName} p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={order.status} />
                {requiresOnlinePayment ? (
                  <PaymentStatusPill status={order.onlinePaymentStatus} />
                ) : null}
                {requiresBalancePayment ? (
                  <PaymentStatusPill status={order.balancePaymentStatus} />
                ) : null}
              </div>
              <p className="text-2xl font-semibold text-slate-900">{formatPrice(order.total)}</p>
            </div>
            <p className="mt-3 text-sm text-slate-600">{order.paymentMethod ?? order.payment}</p>
            {requiresOnlinePayment ? (
              <p className="mt-2 text-sm font-medium text-slate-800">
                Online advance required: {advancePercent}% · {formatPrice(onlineDue)}
                {onlineReceived > 0 ? ` · Received ${formatPrice(onlineReceived)}` : ""}
                {onlineRemaining > 0 ? ` · Remaining ${formatPrice(onlineRemaining)}` : ""}
              </p>
            ) : null}
            {requiresBalancePayment ? (
              <p className="mt-1 text-sm text-slate-600">
                On delivery: {formatPrice(codDue)}
                {codReceived > 0 ? ` · Received ${formatPrice(codReceived)}` : ""}
                {codRemaining > 0 ? ` · Remaining ${formatPrice(codRemaining)}` : ""}
              </p>
            ) : null}
          </section>

          <section className={`${adminCardClassName} p-6`}>
            <h2 className="text-base font-semibold text-slate-900">Customer & delivery</h2>
            <dl className="mt-4">
              <InfoRow label="Name" value={order.customer} />
              <InfoRow label="Email" value={order.email} />
              <InfoRow label="Phone" value={order.phone} />
              <InfoRow label="Address" value={order.address} multiline />
              <InfoRow
                label="City / Country"
                value={[order.city, order.country].filter(Boolean).join(", ")}
              />
              <InfoRow
                label="Notes"
                value={order.notes || "—"}
                multiline={Boolean(order.notes?.trim())}
              />
            </dl>
          </section>

          <section className={`${adminCardClassName} overflow-hidden`}>
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-900">Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="px-6 py-3 font-semibold">Qty</th>
                    <th className="px-6 py-3 font-semibold">Delivery</th>
                    <th className="px-6 py-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => {
                    const advanceNote = formatAdvanceNote(item);

                    return (
                      <tr
                        key={`${item.productId}-${item.deliveryOptionId ?? "default"}`}
                        className="border-t border-slate-100"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900">{item.name}</p>
                              {item.fulfillmentType === "PRE_ORDER" ? (
                                <p className="text-xs text-amber-700">Pre-order</p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{item.quantity}</td>
                        <td className="px-6 py-4 text-slate-600">
                          <p>{formatDeliveryLine(item)}</p>
                          {advanceNote ? (
                            <p className="mt-1 text-xs font-medium text-sky-700">{advanceNote}</p>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <div className="ml-auto max-w-xs space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span>
                    {order.deliveryTotal > 0 ? formatPrice(order.deliveryTotal) : "Free"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                {requiresOnlinePayment ? (
                  <>
                    <div className="flex justify-between text-slate-700">
                      <span>Online advance ({advancePercent}%)</span>
                      <span>{formatPrice(onlineDue)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Received online</span>
                      <span>{formatPrice(onlineReceived)}</span>
                    </div>
                    {onlineRemaining > 0 ? (
                      <div className="flex justify-between font-medium text-amber-800">
                        <span>Still pending online</span>
                        <span>{formatPrice(onlineRemaining)}</span>
                      </div>
                    ) : null}
                  </>
                ) : null}
                {requiresBalancePayment ? (
                  <>
                    <div className="flex justify-between text-slate-700">
                      <span>Due on delivery (COD)</span>
                      <span>{formatPrice(codDue)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Received on delivery</span>
                      <span>{formatPrice(codReceived)}</span>
                    </div>
                    {codRemaining > 0 ? (
                      <div className="flex justify-between font-medium text-amber-800">
                        <span>Still pending on delivery</span>
                        <span>{formatPrice(codRemaining)}</span>
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          </section>

          <section className={`${adminCardClassName} p-6`}>
            <h2 className="text-base font-semibold text-slate-900">Tracking</h2>
            <div className="mt-4">
              <OrderTrackingTimeline
                status={order.status}
                fulfillmentKind={order.fulfillmentKind ?? "standard"}
                variant="light"
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {requiresOnlinePayment ? (
            <section className={`${adminCardClassName} p-6`}>
              <h2 className="text-base font-semibold text-slate-900">Record online payment</h2>
              <p className="mt-2 text-sm text-slate-500">
                No payment gateway yet — after calling the customer, record how much they paid
                online (JazzCash, bank transfer, etc.).
              </p>

              <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Advance required</span>
                  <span className="font-semibold text-slate-900">
                    {advancePercent}% · {formatPrice(onlineDue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Already recorded</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(onlineReceived)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-600">Still to collect</span>
                  <span className="font-semibold text-amber-800">
                    {formatPrice(onlineRemaining)}
                  </span>
                </div>
              </div>

              <label className="mt-5 flex flex-col gap-2">
                <span className={adminLabelClassName}>Amount received (PKR)</span>
                <input
                  type="number"
                  min="0"
                  max={onlineDue}
                  step="1"
                  value={paymentReceived}
                  onChange={(event) => setPaymentReceived(event.target.value)}
                  className={adminInputClassName}
                />
              </label>

              <label className="mt-4 flex flex-col gap-2">
                <span className={adminLabelClassName}>Note (optional)</span>
                <textarea
                  rows={2}
                  value={paymentNote}
                  onChange={(event) => setPaymentNote(event.target.value)}
                  placeholder="e.g. JazzCash ref #12345"
                  className={`${adminInputClassName} resize-none`}
                />
              </label>

              <button
                type="button"
                disabled={isSavingPayment}
                onClick={() => handleSavePayment(Number(paymentReceived || 0))}
                className={`${adminPrimaryButtonClassName} mt-5 w-full`}
              >
                {isSavingPayment ? "Saving..." : "Save payment"}
              </button>

              {onlineRemaining > 0 ? (
                <button
                  type="button"
                  disabled={isSavingPayment}
                  onClick={() => {
                    setPaymentReceived(String(onlineDue));
                    handleSavePayment(onlineDue);
                  }}
                  className={`${adminSecondaryButtonClassName} mt-3 w-full`}
                >
                  Mark full {formatPrice(onlineDue)} received
                </button>
              ) : null}

              {paymentMessage ? (
                <p
                  className={`mt-3 text-sm font-medium ${
                    paymentMessage.includes("updated")
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {paymentMessage}
                </p>
              ) : null}

              {order.onlinePaymentRecordedAt ? (
                <p className="mt-3 text-xs text-slate-500">
                  Last updated{" "}
                  {new Date(order.onlinePaymentRecordedAt).toLocaleString("en-PK", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              ) : null}
            </section>
          ) : null}

          {requiresBalancePayment ? (
            <section className={`${adminCardClassName} p-6`}>
              <h2 className="text-base font-semibold text-slate-900">
                Record delivery payment (COD)
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                When the customer pays the remaining balance on delivery — or full amount for
                standard COD orders — record it here after delivery or collection.
              </p>

              <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Due on delivery</span>
                  <span className="font-semibold text-slate-900">{formatPrice(codDue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Already recorded</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(codReceived)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-600">Still to collect</span>
                  <span className="font-semibold text-amber-800">
                    {formatPrice(codRemaining)}
                  </span>
                </div>
              </div>

              <label className="mt-5 flex flex-col gap-2">
                <span className={adminLabelClassName}>Amount received on delivery (PKR)</span>
                <input
                  type="number"
                  min="0"
                  max={codDue}
                  step="1"
                  value={balanceReceived}
                  onChange={(event) => setBalanceReceived(event.target.value)}
                  className={adminInputClassName}
                />
              </label>

              <label className="mt-4 flex flex-col gap-2">
                <span className={adminLabelClassName}>Note (optional)</span>
                <textarea
                  rows={2}
                  value={balanceNote}
                  onChange={(event) => setBalanceNote(event.target.value)}
                  placeholder="e.g. Cash collected on delivery"
                  className={`${adminInputClassName} resize-none`}
                />
              </label>

              <button
                type="button"
                disabled={isSavingBalance}
                onClick={() => handleSaveBalancePayment(Number(balanceReceived || 0))}
                className={`${adminPrimaryButtonClassName} mt-5 w-full`}
              >
                {isSavingBalance ? "Saving..." : "Save delivery payment"}
              </button>

              {codRemaining > 0 ? (
                <button
                  type="button"
                  disabled={isSavingBalance}
                  onClick={() => {
                    setBalanceReceived(String(codDue));
                    handleSaveBalancePayment(codDue);
                  }}
                  className={`${adminSecondaryButtonClassName} mt-3 w-full`}
                >
                  Mark full {formatPrice(codDue)} received
                </button>
              ) : null}

              {balanceMessage ? (
                <p
                  className={`mt-3 text-sm font-medium ${
                    balanceMessage.includes("updated")
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {balanceMessage}
                </p>
              ) : null}

              {order.balancePaymentRecordedAt ? (
                <p className="mt-3 text-xs text-slate-500">
                  Last updated{" "}
                  {new Date(order.balancePaymentRecordedAt).toLocaleString("en-PK", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              ) : null}
            </section>
          ) : null}

          <section className={`${adminCardClassName} p-6`}>
            <h2 className="text-base font-semibold text-slate-900">Update status</h2>
            <p className="mt-2 text-sm text-slate-500">
              Mark shipped when dispatched, delivered when the customer receives the order.
            </p>
            <label className="mt-5 flex flex-col gap-2">
              <span className={adminLabelClassName}>Status</span>
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
              {isSaving ? "Saving..." : "Save status"}
            </button>
            {savedMessage ? (
              <p className="mt-3 text-sm font-medium text-emerald-600">{savedMessage}</p>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
}
