"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import OrderDeliveredSummary from "../orders/OrderDeliveredSummary";
import OrderTrackingTimeline from "../orders/OrderTrackingTimeline";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { fetchMyOrders } from "../../lib/api/orders";
import { formatPrice } from "../../lib/data/products";
import {
  getOrderStatusLabel,
  isOrderDelivered,
} from "../../lib/orders/order-status";
import {
  fetchOrderItemReviewStatus,
  isOrderItemReviewed,
  normalizeProductId,
} from "../../lib/reviews/review-storage";
import Reveal from "../ui/Reveal";
import ReviewSubmitModal from "../reviews/ReviewSubmitModal";

const statusStyles = {
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  confirmed: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  shipped: "border-[#FFB347]/25 bg-[#FFB347]/10 text-[#FFD9A6]",
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
  const router = useRouter();
  const { isLoading: isAuthLoading, isAuthenticated } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewStatusMap, setReviewStatusMap] = useState({});
  const [reviewRefresh, setReviewRefresh] = useState(0);

  const deliveredOrderItems = useMemo(() => {
    const items = [];

    for (const order of orders) {
      if (!isOrderDelivered(order.status)) continue;

      for (const item of order.items ?? []) {
        const productId = normalizeProductId(item.productId);
        if (!productId) continue;

        items.push({
          orderNumber: order.id,
          productId,
        });
      }
    }

    return items;
  }, [orders]);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/checkout");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    let active = true;

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchMyOrders();
        if (active) setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) {
          setError(err.message ?? "Could not load orders.");
          setOrders([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, [isAuthLoading, isAuthenticated]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated || deliveredOrderItems.length === 0) {
      setReviewStatusMap({});
      return;
    }

    let active = true;

    async function loadReviewStatus() {
      try {
        const status = await fetchOrderItemReviewStatus(deliveredOrderItems);
        if (active) setReviewStatusMap(status ?? {});
      } catch {
        if (active) setReviewStatusMap({});
      }
    }

    loadReviewStatus();
    return () => {
      active = false;
    };
  }, [isAuthLoading, isAuthenticated, deliveredOrderItems, reviewRefresh]);

  if (isAuthLoading || loading) {
    return (
      <div className="pb-16 pt-8 sm:pt-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pb-16 pt-8 sm:pt-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
              My Orders
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Order history</h1>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Active orders show live tracking. Delivered orders show a completion summary.
            </p>
          </Reveal>

          {error ? (
            <p className="mt-6 text-sm text-amber-200">{error}</p>
          ) : null}

          {orders.length === 0 ? (
            <Reveal delay={60}>
              <div className="mt-10 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] px-6 py-12 text-center">
                <p className="text-lg font-semibold text-white">No orders yet</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Place an order first, then track delivery status here.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A]"
                >
                  Shop Products
                </Link>
              </div>
            </Reveal>
          ) : (
            <div className="mt-10 space-y-4">
              {orders.map((order, index) => {
                const delivered = isOrderDelivered(order.status);

                return (
                  <Reveal key={order.id} delay={index * 50}>
                    <article
                      className={[
                        "rounded-[1.75rem] border p-6",
                        delivered
                          ? "border-emerald-500/15 bg-emerald-500/[0.04]"
                          : "border-white/[0.08] bg-white/[0.03]",
                      ].join(" ")}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{order.id}</p>
                          <p className="mt-1 text-sm text-zinc-500">
                            {new Date(order.createdAt).toLocaleDateString("en-PK")}
                          </p>
                        </div>
                        <OrderStatusPill status={order.status} />
                      </div>

                      {delivered ? (
                        <OrderDeliveredSummary status={order.status} />
                      ) : (
                        <div className="mt-6">
                          <OrderTrackingTimeline
                            status={order.status}
                            variant="dark"
                            compact
                          />
                        </div>
                      )}

                      <div className="mt-5 space-y-3">
                        {order.items?.map((item) => {
                          const productId = normalizeProductId(item.productId);
                          const reviewed = isOrderItemReviewed(
                            order.id,
                            productId,
                            reviewStatusMap,
                          );

                          return (
                            <div
                              key={`${order.id}-${productId}`}
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
                                {delivered && reviewed ? (
                                  <span className="text-xs font-medium text-emerald-300">
                                    Review submitted
                                  </span>
                                ) : delivered ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (reviewed) return;
                                      setReviewTarget({
                                        orderNumber: order.id,
                                        productId,
                                        productName: item.name,
                                      });
                                    }}
                                    className="cursor-pointer rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-500/15"
                                  >
                                    Add review
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {reviewTarget && !isOrderItemReviewed(
        reviewTarget.orderNumber,
        reviewTarget.productId,
        reviewStatusMap,
      ) ? (
        <ReviewSubmitModal
          open={Boolean(reviewTarget)}
          onClose={() => setReviewTarget(null)}
          orderNumber={reviewTarget.orderNumber}
          productId={reviewTarget.productId}
          productName={reviewTarget.productName}
          onSubmitted={() => setReviewRefresh((tick) => tick + 1)}
        />
      ) : null}
    </>
  );
}
