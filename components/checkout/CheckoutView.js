"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutAuthSection from "../auth/CheckoutAuthSection";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { formatPrice } from "../../lib/data/products";
import { saveLastOrder } from "../../lib/cart/storage";
import { createOrder } from "../../lib/api/orders";
import { inputClassName, labelClassName } from "../../lib/ui/formStyles";
import Reveal from "../ui/Reveal";
import OrderCompleteSuccess from "./OrderCompleteSuccess";
import { useToast } from "../../context/ToastContext";

export default function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, deliveryTotal, total, clearCart, isReady } = useCart();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useCustomerAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    if (isReady && items.length === 0 && !completedOrder) {
      router.replace("/cart");
    }
  }, [isReady, items.length, router, completedOrder]);

  if (!isReady) {
    return null;
  }

  if (completedOrder) {
    return <OrderCompleteSuccess order={completedOrder} />;
  }

  if (items.length === 0) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated || !user) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const order = await createOrder({
        items: items.map((item) => ({ ...item })),
        subtotal,
        deliveryTotal,
        total,
        paymentMethod: "Cash on Delivery",
        customer: {
          fullName: String(formData.get("fullName") || user.name || ""),
          email: String(formData.get("email") || user.email || ""),
          phone: String(formData.get("phone") || ""),
          address: String(formData.get("address") || ""),
          city: String(formData.get("city") || ""),
          notes: String(formData.get("notes") || ""),
        },
      });

      saveLastOrder(order);
      setCompletedOrder(order);
      clearCart();
      router.replace(`/checkout/success?order=${order.id}`);
    } catch (err) {
      showToast(err.message ?? "Could not place order.", "error");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Complete your order</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Pehle sign in karein, phir delivery details fill karein. Payment delivery par hogi.
          </p>
        </Reveal>

        <div className="mt-10 space-y-8 relative z-0">
          <Reveal delay={30}>
            <CheckoutAuthSection />
          </Reveal>

          <form
            onSubmit={handleSubmit}
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
          >
            <Reveal delay={60}>
              <div
                className={[
                  "rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-8",
                  !isAuthenticated && !isAuthLoading ? "pointer-events-none opacity-50" : "",
                ].join(" ")}
              >
                <h2 className="text-xl font-semibold text-white">Delivery details</h2>

                {/* {!isAuthenticated && !isAuthLoading ? (
                  <p className="mt-3 text-sm text-amber-200/90">
                    Delivery form tab unlock hoga jab aap sign in ho jayenge.
                  </p>
                ) : null} */}

                <div className="mt-6 space-y-5">
                  <label className="flex flex-col gap-2.5">
                    <span className={labelClassName}>Full name</span>
                    <input
                      type="text"
                      name="fullName"
                      required
                      defaultValue={user?.name ?? ""}
                      placeholder="Ali Khan"
                      className={inputClassName}
                      disabled={!isAuthenticated}
                    />
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2.5">
                      <span className={labelClassName}>Email</span>
                      <input
                        type="email"
                        name="email"
                        required
                        defaultValue={user?.email ?? ""}
                        placeholder="you@example.com"
                        className={inputClassName}
                        disabled={!isAuthenticated}
                        readOnly={Boolean(user?.email)}
                      />
                    </label>

                    <label className="flex flex-col gap-2.5">
                      <span className={labelClassName}>Phone number</span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+92 300 0000000"
                        className={inputClassName}
                        disabled={!isAuthenticated}
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2.5">
                    <span className={labelClassName}>Delivery address</span>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      placeholder="House / street / area"
                      className={`${inputClassName} resize-none`}
                      disabled={!isAuthenticated}
                    />
                  </label>

                  <label className="flex flex-col gap-2.5">
                    <span className={labelClassName}>City</span>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Lahore"
                      className={inputClassName}
                      disabled={!isAuthenticated}
                    />
                  </label>

                  <label className="flex flex-col gap-2.5">
                    <span className={labelClassName}>Order notes (optional)</span>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Any delivery instructions..."
                      className={`${inputClassName} resize-none`}
                      disabled={!isAuthenticated}
                    />
                  </label>
                </div>
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={100}>
                <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                  <h2 className="text-lg font-semibold text-white">Payment method</h2>
                  <label className="mt-5 flex cursor-pointer items-start gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      defaultChecked
                      className="mt-1 accent-emerald-400"
                      disabled={!isAuthenticated}
                    />
                    <span>
                      <span className="block font-semibold text-white">Cash on Delivery</span>
                      <span className="mt-1 block text-sm leading-6 text-zinc-400">
                        Pay with cash when your order arrives at your doorstep.
                      </span>
                    </span>
                  </label>
                </div>
              </Reveal>

              <Reveal delay={140}>
                <aside className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                  <h2 className="text-lg font-semibold text-white">Order summary</h2>

                  <div className="mt-5 space-y-4">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-zinc-900">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{item.name}</p>
                          <p className="text-xs text-zinc-500">Qty {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-white/[0.06] pt-4">
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Subtotal</span>
                      <span className="text-white">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-zinc-400">
                      <span>Delivery</span>
                      <span className={deliveryTotal > 0 ? "text-amber-200" : "text-emerald-300"}>
                        {deliveryTotal > 0 ? formatPrice(deliveryTotal) : "Free"}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-medium text-white">Total due on delivery</span>
                      <span className="text-2xl font-bold text-white">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isAuthenticated}
                    className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_32px_rgba(139,92,246,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {!isAuthenticated
                      ? "Sign in to place order"
                      : isSubmitting
                        ? "Placing order..."
                        : "Place Order"}
                  </button>

                  <Link
                    href="/cart"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-violet-500/35 hover:bg-white/[0.06]"
                  >
                    Back to Cart
                  </Link>
                </aside>
              </Reveal>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
