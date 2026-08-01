"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutAuthSection from "../auth/CheckoutAuthSection";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { formatPrice } from "../../lib/data/products";
import { saveLastOrder } from "../../lib/cart/storage";
import { createOrder } from "../../lib/api/orders";
import {
  PAYMENT_CHECKOUT_BODY,
  PAYMENT_CHECKOUT_TITLE,
} from "../../lib/content/store-policy";
import {
  paymentMethodFromFormValue,
  PAYMENT_ONLINE_CHECKOUT_BODY,
  PAYMENT_ONLINE_CHECKOUT_TITLE,
} from "../../lib/payments/checkout";
import { cartHasPreOrderItems, formatExpectedShipFromLine, isCartLinePreOrder } from "../../lib/products/fulfillment";
import {
  PRE_ORDER_CHECKOUT_ACK,
  PRE_ORDER_CHECKOUT_ACK_ONLINE,
  PRE_ORDER_CHECKOUT_BODY,
  PRE_ORDER_CHECKOUT_BODY_INTERNATIONAL,
  PRE_ORDER_CHECKOUT_TITLE,
  PRE_ORDER_MIXED_CART,
} from "../../lib/content/pre-order";
import { inputClassName, labelClassName } from "../../lib/ui/formStyles";
import Reveal from "../ui/Reveal";
import OrderCompleteSuccess from "./OrderCompleteSuccess";
import { useToast } from "../../context/ToastContext";

export default function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, deliveryTotal, deliveryNote, fulfillmentKind, total, clearCart, isReady } =
    useCart();
  const [preOrderAck, setPreOrderAck] = useState(false);
  const { user, isLoading: isAuthLoading, isAuthenticated } = useCustomerAuth();
  const { currency, countryCode, pkrToUsdRate, isInternationalDisplay, isPakistanVisitor } =
    useCurrency();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [paymentChoice, setPaymentChoice] = useState(isPakistanVisitor ? "cod" : "online");

  useEffect(() => {
    setPaymentChoice(isPakistanVisitor ? "cod" : "online");
  }, [isPakistanVisitor]);

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

  const hasPreOrderLines = cartHasPreOrderItems(items);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated || !user) {
      return;
    }

    if (hasPreOrderLines && !preOrderAck) {
      showToast("Please confirm the pre-order terms to continue.", "error");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const methodKey = String(formData.get("paymentMethod") || paymentChoice);
      const paymentMethod = paymentMethodFromFormValue(
        isPakistanVisitor ? methodKey : "online",
      );

      const order = await createOrder({
        items: items.map((item) => ({ ...item })),
        subtotal,
        deliveryTotal,
        total,
        paymentMethod,
        displayCurrency: currency,
        exchangeRate: isInternationalDisplay ? pkrToUsdRate : undefined,
        customerCountry: countryCode,
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

  const paysOnDelivery =
    isPakistanVisitor && paymentChoice === "cod";

  return (
    <div className="pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Complete your order</h1>
          <p className="mt-3 text-sm text-zinc-400">
            {isPakistanVisitor
              ? "Sign in, add delivery details, then choose cash on delivery or online payment."
              : "Sign in and add delivery details. Online payment is required for orders outside Pakistan."}
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
                  {hasPreOrderLines ? (
                    <div className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
                      <p className="text-sm font-semibold text-amber-100">
                        {PRE_ORDER_CHECKOUT_TITLE}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {isPakistanVisitor
                          ? PRE_ORDER_CHECKOUT_BODY
                          : PRE_ORDER_CHECKOUT_BODY_INTERNATIONAL}
                      </p>
                      {fulfillmentKind === "mixed" ? (
                        <p className="mt-3 text-xs leading-5 text-zinc-500">
                          {PRE_ORDER_MIXED_CART}
                        </p>
                      ) : null}
                      <label className="mt-4 flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={preOrderAck}
                          onChange={(event) => setPreOrderAck(event.target.checked)}
                          className="mt-1 accent-amber-400"
                          disabled={!isAuthenticated}
                        />
                        <span className="text-sm leading-6 text-zinc-300">
                          {isPakistanVisitor
                            ? PRE_ORDER_CHECKOUT_ACK
                            : PRE_ORDER_CHECKOUT_ACK_ONLINE}
                        </span>
                      </label>
                    </div>
                  ) : null}

                  <h2 className="text-lg font-semibold text-white">Payment method</h2>
                  <div className="mt-5 space-y-3">
                    {isPakistanVisitor ? (
                      <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentChoice === "cod"}
                          onChange={() => setPaymentChoice("cod")}
                          className="mt-1 accent-emerald-400"
                          disabled={!isAuthenticated}
                        />
                        <span>
                          <span className="block font-semibold text-white">
                            {PAYMENT_CHECKOUT_TITLE}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-zinc-400">
                            {PAYMENT_CHECKOUT_BODY}
                          </span>
                        </span>
                      </label>
                    ) : null}

                    <label
                      className={[
                        "flex cursor-pointer items-start gap-4 rounded-2xl border p-4",
                        isPakistanVisitor
                          ? "border-sky-500/25 bg-sky-500/10"
                          : "border-sky-500/30 bg-sky-500/15",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentChoice === "online"}
                        onChange={() => setPaymentChoice("online")}
                        className="mt-1 accent-sky-400"
                        disabled={!isAuthenticated}
                      />
                      <span>
                        <span className="block font-semibold text-white">
                          {PAYMENT_ONLINE_CHECKOUT_TITLE}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-zinc-400">
                          {PAYMENT_ONLINE_CHECKOUT_BODY}
                        </span>
                      </span>
                    </label>
                  </div>
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
                          <p className="text-xs text-zinc-500">
                            Qty {item.quantity}
                            {isCartLinePreOrder(item) ? " · Pre-order" : ""}
                          </p>
                          {isCartLinePreOrder(item) && formatExpectedShipFromLine(item) ? (
                            <p className="text-xs text-amber-200/90">
                              Est. ship: {formatExpectedShipFromLine(item)}
                            </p>
                          ) : null}
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
                    {deliveryNote ? (
                      <p className="mt-2 text-xs leading-5 text-zinc-500">{deliveryNote}</p>
                    ) : null}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-medium text-white">
                        {paysOnDelivery ? "Total due on delivery" : "Total to pay"}
                      </span>
                      <span className="text-2xl font-bold text-white">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isAuthenticated}
                    className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,179,71,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {!isAuthenticated
                      ? "Sign in to place order"
                      : isSubmitting
                        ? "Placing order..."
                        : "Place Order"}
                  </button>

                  <Link
                    href="/cart"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#FFB347]/35 hover:bg-white/[0.06]"
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
