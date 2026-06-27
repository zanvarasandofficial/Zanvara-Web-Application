"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../lib/data/products";
import { formatDeliveryLabel } from "../../lib/products/delivery";
import Reveal from "../ui/Reveal";

export default function CartView() {
  const { items, subtotal, deliveryTotal, total, updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="pb-16 pt-8 sm:pt-10">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
              Your Cart
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Cart is empty</h1>
            <p className="mt-4 text-base leading-8 text-zinc-400">
              Browse our catalog and add products to start your order.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,179,71,0.35)]"
            >
              Shop All Products
            </Link>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
            Your Cart
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Shopping Cart</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Review your items, update quantities, and proceed to checkout.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {items.map((item, index) => {
              const itemDeliveryLabel = formatDeliveryLabel(item);
              const itemDeliveryIsFree = itemDeliveryLabel === "Free";

              return (
              <Reveal key={item.productId} delay={index * 40}>
                <article className="grid gap-4 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:grid-cols-[120px_minmax(0,1fr)] sm:p-5">
                  <Link
                    href={`/products/${item.productId}`}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="120px"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-lg font-semibold text-white transition-colors hover:text-[#FFD9A6]"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-zinc-500">
                          {item.stock} available in stock
                        </p>
                        <p
                          className={[
                            "mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            itemDeliveryIsFree
                              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                              : "border border-amber-500/20 bg-amber-500/10 text-amber-200",
                          ].join(" ")}
                        >
                          Delivery: {itemDeliveryLabel}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="cursor-pointer rounded-xl px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="inline-flex items-center rounded-2xl border border-white/10 bg-black/30">
                        <button
                          type="button"
                          onClick={() => {
                            const result = updateQuantity(
                              item.productId,
                              item.quantity - 1,
                            );
                            if (!result.ok) showToast(result.message, "error");
                          }}
                          disabled={item.quantity <= 1}
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-2xl text-white transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-10 text-center text-sm font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const result = updateQuantity(
                              item.productId,
                              item.quantity + 1,
                            );
                            if (!result.ok) showToast(result.message, "error");
                          }}
                          disabled={item.quantity >= item.stock}
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-2xl text-white transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 ? (
                          <p className="text-xs text-zinc-500">
                            {formatPrice(item.price)} each
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
              );
            })}
          </div>

          <Reveal delay={120}>
            <aside className="h-fit rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <h2 className="text-lg font-semibold text-white">Order Summary</h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Delivery</span>
                  <span className={deliveryTotal > 0 ? "text-amber-200" : "text-emerald-300"}>
                    {deliveryTotal > 0 ? formatPrice(deliveryTotal) : "Free"}
                  </span>
                </div>
                <div className="border-t border-white/[0.06] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">Total</span>
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Cash on delivery — pay when your order arrives.
                  </p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,179,71,0.35)]"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#FFB347]/35 hover:bg-white/[0.06]"
              >
                Continue Shopping
              </Link>
            </aside>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
