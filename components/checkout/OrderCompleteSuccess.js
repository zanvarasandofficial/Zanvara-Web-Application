"use client";

import Link from "next/link";
import { formatPrice } from "../../lib/data/products";
import Reveal from "../ui/Reveal";

export default function OrderCompleteSuccess({ order }) {
  return (
    <div className="pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 px-6 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
                <path
                  d="M7 12L10 15L17 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Order successful
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Thank you for shopping with Zanvara!
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-zinc-300">
              Your order has been placed successfully. We have received your details and
              will confirm delivery soon. Payment will be collected on delivery.
            </p>

            {order ? (
              <div className="mx-auto mt-8 max-w-md rounded-[1.5rem] border border-white/[0.08] bg-black/20 p-5 text-left">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-500">Order ID</span>
                  <span className="font-semibold text-white">{order.id}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-500">Payment</span>
                  <span className="text-white">{order.paymentMethod}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-500">Total</span>
                  <span className="font-semibold text-white">{formatPrice(order.total)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-500">Items</span>
                  <span className="text-white">{order.items.length}</span>
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_32px_rgba(139,92,246,0.35)]"
              >
                Continue Shopping
              </Link>
              <Link
                href="/account/orders"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-violet-500/35 hover:bg-white/[0.06]"
              >
                Track My Orders
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
