"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import OrderTrackingTimeline from "../orders/OrderTrackingTimeline";
import { formatPrice } from "../../lib/data/products";
import {
  getOrderStatusLabel,
  isOrderDelivered,
} from "../../lib/orders/order-status";
import { readOrderHistory } from "../../lib/orders/order-storage";
import Reveal from "../ui/Reveal";
import ReviewSubmitModal from "../reviews/ReviewSubmitModal";

const statusStyles = {
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  confirmed: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  shipped: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  delivered: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  cancelled: "border-rose-500/20 bg-rose-500/10 text-rose-300",
};

function OrderStatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status] || statusStyles.pending}`}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}

export default function MyOrdersView() {
  const [orders, setOrders] = useState([]);
  const [reviewTarget, setReviewTarget] = useState(null);

  useEffect(() => {
    function loadOrders() {
      setOrders(readOrderHistory());
    }

    loadOrders();

    function handleStorage(event) {
      if (event.key === "zanvara-orders" || event.key === null) {
        loadOrders();
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("zanvara-orders-changed", loadOrders);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("zanvara-orders-changed", loadOrders);
    };
  }, []);

  return (
    <>
      <div className="pb-16 pt-8 sm:pt-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
              My Orders
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Order history</h1>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Track your parcel from warehouse dispatch to delivery. Reviews unlock once your
              order is marked{" "}
              <span className="font-medium text-emerald-300">Delivered</span>.
            </p>
          </Reveal>

          {orders.length === 0 ? (
            <Reveal delay={60}>
              <div className="mt-10 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] px-6 py-12 text-center">
                <p className="text-lg font-semibold text-white">No orders yet</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Place an order first, then track delivery status here.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white"
                >
                  Shop Products
                </Link>
              </div>
            </Reveal>
          ) : (
            <div className="mt-10 space-y-4">
              {orders.map((order, index) => (
                <Reveal key={order.id} delay={index * 50}>
                  <article className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{order.id}</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {new Date(order.createdAt).toLocaleDateString("en-PK")}
                        </p>
                      </div>
                      <OrderStatusPill status={order.status} />
                    </div>

                    <div className="mt-6">
                      <OrderTrackingTimeline status={order.status} variant="dark" compact />
                    </div>

                    <div className="mt-5 space-y-3">
                      {order.items?.map((item) => (
                        <div
                          key={`${order.id}-${item.productId}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-sm text-zinc-500">Qty {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            {isOrderDelivered(order.status) ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setReviewTarget({
                                    productId: item.productId,
                                    productName: item.name,
                                  })
                                }
                                className="cursor-pointer rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-500/15"
                              >
                                Write review
                              </button>
                            ) : (
                              <span className="text-xs text-zinc-500">
                                Review after delivery
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewSubmitModal
        open={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        productId={reviewTarget?.productId}
        productName={reviewTarget?.productName}
      />
    </>
  );
}
