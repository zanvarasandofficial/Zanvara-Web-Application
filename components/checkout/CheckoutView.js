"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  PAYMENT_FULL_ONLINE_REQUIRED_NOTE,
  PAYMENT_ONLINE_CHECKOUT_BODY,
  PAYMENT_ONLINE_CHECKOUT_TITLE,
  PAYMENT_PARTIAL_CHECKOUT_BODY,
  PAYMENT_PARTIAL_CHECKOUT_TITLE,
} from "../../lib/payments/checkout";
import { calculateCartPaymentRequirement } from "../../lib/payments/delivery-payment";
import { useStorePolicy } from "../../context/StorePolicyContext";
import {
  cartHasPreOrderItems,
  formatExpectedShipFromLine,
  isCartLinePreOrder,
} from "../../lib/products/fulfillment";
import { resolveCatalogProduct } from "../../lib/products/live-catalog";
import {
  PRE_ORDER_CHECKOUT_ACK,
  PRE_ORDER_CHECKOUT_ACK_ONLINE,
  PRE_ORDER_CHECKOUT_BODY,
  PRE_ORDER_CHECKOUT_BODY_INTERNATIONAL,
  PRE_ORDER_CHECKOUT_TITLE,
  PRE_ORDER_MIXED_CART,
} from "../../lib/content/pre-order";
import {
  getDefaultShippingCountryCode,
  getShippingCountryLabel,
  SHIPPING_COUNTRIES,
} from "../../lib/geo/shipping-countries";
import {
  blockPhoneAlphaKeyDown,
  handlePhoneInputChange,
} from "../../lib/forms/phone";
import { inputClassName, labelClassName } from "../../lib/ui/formStyles";
import Reveal from "../ui/Reveal";
import OrderCompleteSuccess from "./OrderCompleteSuccess";
import CheckoutDeliverySelect from "./CheckoutDeliverySelect";
import { useToast } from "../../context/ToastContext";

const panelClassName =
  "rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-8";

function StepBadge({ number, label, active }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          active
            ? "bg-gradient-to-br from-[#FFB347] to-[#F59E0B] text-[#0A0A0A]"
            : "border border-white/10 bg-white/[0.04] text-zinc-400",
        ].join(" ")}
      >
        {number}
      </span>
      <span className={active ? "text-sm font-semibold text-white" : "text-sm text-zinc-500"}>
        {label}
      </span>
    </div>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const {
    items,
    subtotal,
    deliveryTotal,
    deliveryNote,
    fulfillmentKind,
    total,
    clearCart,
    isReady,
    updateDeliveryOption,
  } = useCart();
  const [preOrderAck, setPreOrderAck] = useState(false);
  const { user, isLoading: isAuthLoading, isAuthenticated } = useCustomerAuth();
  const { currency, countryCode, pkrToUsdRate, isInternationalDisplay, isPakistanVisitor } =
    useCurrency();
  const defaultShippingCountry = useMemo(
    () => getDefaultShippingCountryCode(countryCode),
    [countryCode],
  );
  const { freeDeliveryMinTableQuantity } = useStorePolicy();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [paymentChoice, setPaymentChoice] = useState(isPakistanVisitor ? "cod" : "online");

  const paymentRequirement = useMemo(
    () =>
      calculateCartPaymentRequirement(items, {
        subtotal,
        deliveryTotal,
        total,
        freeDeliveryMinTableQuantity,
      }),
    [items, subtotal, deliveryTotal, total, freeDeliveryMinTableQuantity],
  );

  useEffect(() => {
    if (paymentRequirement.mode === "full_online") {
      setPaymentChoice("online");
      return;
    }

    if (paymentRequirement.mode === "partial_online") {
      setPaymentChoice(isPakistanVisitor ? "partial" : "online");
      return;
    }

    setPaymentChoice(isPakistanVisitor ? "cod" : "online");
  }, [paymentRequirement.mode, isPakistanVisitor]);

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
  const hasDeliveryChoices = items.some((item) => !isCartLinePreOrder(item));
  const formLocked = !isAuthenticated && !isAuthLoading;

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
        onlinePaymentDue: paymentRequirement.onlinePaymentDue,
        balanceOnDelivery: paymentRequirement.balanceOnDelivery,
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
          country: getShippingCountryLabel(
            String(formData.get("country") || defaultShippingCountry),
          ),
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
    isPakistanVisitor &&
    paymentChoice === "cod" &&
    paymentRequirement.mode === "cod_ok";

  return (
    <div className="pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Complete your order</h1>
        </Reveal>

        <div className="mt-8 hidden gap-4 sm:flex">
          <StepBadge number="1" label="Account" active={!isAuthenticated} />
          <div className="h-px flex-1 self-center bg-white/[0.06]" />
          <StepBadge number="2" label="Shipping" active={isAuthenticated} />
          <div className="h-px flex-1 self-center bg-white/[0.06]" />
          <StepBadge number="3" label="Payment" active={isAuthenticated} />
        </div>

        <div className="mt-10 space-y-8">
          {!isAuthenticated ? (
            <Reveal delay={20}>
              <CheckoutAuthSection />
            </Reveal>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
          >
            <div className="space-y-6">
              <Reveal delay={40}>
                <section
                  className={[panelClassName, formLocked ? "pointer-events-none opacity-50" : ""].join(
                    " ",
                  )}
                >
                  <StepBadge number="2" label="Shipping details" active={isAuthenticated} />

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
                        disabled={formLocked}
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
                          disabled={formLocked}
                          readOnly={Boolean(user?.email)}
                        />
                      </label>

                      <label className="flex flex-col gap-2.5">
                        <span className={labelClassName}>Phone number</span>
                        <input
                          type="tel"
                          name="phone"
                          required
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+92 300 0000000"
                          className={inputClassName}
                          disabled={formLocked}
                          onKeyDown={blockPhoneAlphaKeyDown}
                          onChange={handlePhoneInputChange}
                          onPaste={(event) => {
                            event.preventDefault();
                            const pasted = event.clipboardData.getData("text");
                            event.target.value = pasted.replace(/[^\d+\s()-]/g, "");
                          }}
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
                        disabled={formLocked}
                      />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2.5">
                        <span className={labelClassName}>City</span>
                        <input
                          type="text"
                          name="city"
                          required
                          placeholder="Lahore"
                          className={inputClassName}
                          disabled={formLocked}
                        />
                      </label>

                      <label className="flex flex-col gap-2.5">
                        <span className={labelClassName}>Country</span>
                        <select
                          name="country"
                          required
                          defaultValue={defaultShippingCountry}
                          className={inputClassName}
                          disabled={formLocked}
                        >
                          {SHIPPING_COUNTRIES.map((entry) => (
                            <option key={entry.code} value={entry.code}>
                              {entry.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="flex flex-col gap-2.5">
                      <span className={labelClassName}>Order notes (optional)</span>
                      <textarea
                        name="notes"
                        rows={2}
                        placeholder="Any delivery instructions..."
                        className={`${inputClassName} resize-none`}
                        disabled={formLocked}
                      />
                    </label>
                  </div>
                </section>
              </Reveal>

              {hasDeliveryChoices ? (
                <Reveal delay={60}>
                  <section
                    className={[
                      panelClassName,
                      formLocked ? "pointer-events-none opacity-50" : "",
                    ].join(" ")}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
                      Delivery speed
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      Choose how quickly you want each item delivered.
                    </p>

                    <div className="mt-6 space-y-5">
                      {items.map((item) => {
                        if (isCartLinePreOrder(item)) {
                          return null;
                        }

                        const catalogProduct = resolveCatalogProduct({
                          productId: item.productId,
                          cartItem: item,
                        });

                        return (
                          <div
                            key={item.productId}
                            className="rounded-2xl border border-white/[0.06] bg-black/20 p-4 sm:p-5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="44px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">{item.name}</p>
                                <p className="text-xs text-zinc-500">Qty {item.quantity}</p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <CheckoutDeliverySelect
                                product={catalogProduct}
                                value={item.deliveryOptionId}
                                onChange={(optionId) => {
                                  const result = updateDeliveryOption(item.productId, optionId);
                                  if (!result.ok) {
                                    showToast(result.message, "error");
                                  }
                                }}
                                currency={currency}
                                pkrToUsdRate={pkrToUsdRate}
                                disabled={formLocked}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </Reveal>
              ) : null}
            </div>

            <div className="space-y-6">
              <Reveal delay={80}>
                <aside className={`${panelClassName} lg:sticky lg:top-24`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
                    Order summary
                  </p>

                  <ul className="mt-5 space-y-4">
                    {items.map((item) => (
                      <li key={item.productId} className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
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
                          {!isCartLinePreOrder(item) && item.deliveryLabel ? (
                            <p className="mt-0.5 text-xs text-[#FFD9A6]/80">
                              {item.deliveryLabel}
                              {item.deliveryEta ? ` · ${item.deliveryEta}` : ""}
                            </p>
                          ) : null}
                          {isCartLinePreOrder(item) && formatExpectedShipFromLine(item) ? (
                            <p className="mt-0.5 text-xs text-amber-200/90">
                              Est. ship: {formatExpectedShipFromLine(item)}
                            </p>
                          ) : null}
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {hasPreOrderLines ? (
                    <div className="mt-5 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
                      <p className="text-sm font-semibold text-amber-100">
                        {PRE_ORDER_CHECKOUT_TITLE}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-zinc-400">
                        {isPakistanVisitor
                          ? PRE_ORDER_CHECKOUT_BODY
                          : PRE_ORDER_CHECKOUT_BODY_INTERNATIONAL}
                      </p>
                      {fulfillmentKind === "mixed" ? (
                        <p className="mt-2 text-xs text-zinc-500">{PRE_ORDER_MIXED_CART}</p>
                      ) : null}
                      <label className="mt-4 flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={preOrderAck}
                          onChange={(event) => setPreOrderAck(event.target.checked)}
                          className="mt-1 accent-amber-400"
                          disabled={formLocked}
                        />
                        <span className="text-sm leading-6 text-zinc-300">
                          {isPakistanVisitor
                            ? PRE_ORDER_CHECKOUT_ACK
                            : PRE_ORDER_CHECKOUT_ACK_ONLINE}
                        </span>
                      </label>
                    </div>
                  ) : null}

                  <div className="mt-6 border-t border-white/[0.06] pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span className="text-white">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Delivery</span>
                      <span className={deliveryTotal > 0 ? "text-amber-200" : "text-emerald-300"}>
                        {deliveryTotal > 0 ? formatPrice(deliveryTotal) : "Free"}
                      </span>
                    </div>
                    {deliveryNote ? (
                      <p className="text-xs leading-5 text-zinc-500">{deliveryNote}</p>
                    ) : null}
                    {paymentRequirement.mode === "partial_online" ? (
                      <>
                        <div className="flex justify-between text-zinc-400">
                          <span>Pay online now</span>
                          <span className="text-sky-200">
                            {formatPrice(paymentRequirement.onlinePaymentDue)}
                          </span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>On delivery</span>
                          <span className="text-white">
                            {formatPrice(paymentRequirement.balanceOnDelivery)}
                          </span>
                        </div>
                      </>
                    ) : null}
                    <div className="flex justify-between pt-2 text-lg font-semibold text-white">
                      <span>
                        {paymentRequirement.mode === "full_online"
                          ? "Total (online)"
                          : paysOnDelivery
                            ? "Total due on delivery"
                            : "Total to pay"}
                      </span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </aside>
              </Reveal>

              <Reveal delay={100}>
                <section
                  className={[
                    panelClassName,
                    formLocked ? "pointer-events-none opacity-50" : "",
                  ].join(" ")}
                >
                  <StepBadge number="3" label="Payment method" active={isAuthenticated} />

                  {paymentRequirement.mode === "full_online" ? (
                    <p className="mt-4 rounded-2xl border border-sky-500/25 bg-sky-500/10 px-4 py-3 text-sm leading-6 text-sky-100/90">
                      {PAYMENT_FULL_ONLINE_REQUIRED_NOTE}
                    </p>
                  ) : null}

                  <div className="mt-6 space-y-3">
                    {isPakistanVisitor && paymentRequirement.mode === "cod_ok" ? (
                      <label
                        className={[
                          "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors",
                          paymentChoice === "cod"
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/15",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentChoice === "cod"}
                          onChange={() => setPaymentChoice("cod")}
                          className="mt-1 accent-emerald-400"
                          disabled={formLocked}
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

                    {isPakistanVisitor && paymentRequirement.mode === "partial_online" ? (
                      <label
                        className={[
                          "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors",
                          paymentChoice === "partial"
                            ? "border-amber-500/30 bg-amber-500/10"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/15",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="partial"
                          checked={paymentChoice === "partial"}
                          onChange={() => setPaymentChoice("partial")}
                          className="mt-1 accent-amber-400"
                          disabled={formLocked}
                        />
                        <span>
                          <span className="block font-semibold text-white">
                            {PAYMENT_PARTIAL_CHECKOUT_TITLE}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-zinc-400">
                            {PAYMENT_PARTIAL_CHECKOUT_BODY} Pay{" "}
                            {formatPrice(paymentRequirement.onlinePaymentDue)} now and{" "}
                            {formatPrice(paymentRequirement.balanceOnDelivery)} on delivery.
                          </span>
                        </span>
                      </label>
                    ) : null}

                    {paymentRequirement.mode !== "cod_ok" || !isPakistanVisitor ? (
                      <label
                        className={[
                          "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors",
                          paymentChoice === "online"
                            ? "border-sky-500/30 bg-sky-500/10"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/15",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentChoice === "online"}
                          onChange={() => setPaymentChoice("online")}
                          className="mt-1 accent-sky-400"
                          disabled={formLocked}
                        />
                        <span>
                          <span className="block font-semibold text-white">
                            {PAYMENT_ONLINE_CHECKOUT_TITLE}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-zinc-400">
                            {paymentRequirement.mode === "partial_online"
                              ? `Alternatively, pay the full ${formatPrice(total)} online before dispatch.`
                              : PAYMENT_ONLINE_CHECKOUT_BODY}
                          </span>
                        </span>
                      </label>
                    ) : null}

                    {isPakistanVisitor && paymentRequirement.mode === "cod_ok" ? (
                      <label
                        className={[
                          "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors",
                          paymentChoice === "online"
                            ? "border-sky-500/30 bg-sky-500/10"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/15",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentChoice === "online"}
                          onChange={() => setPaymentChoice("online")}
                          className="mt-1 accent-sky-400"
                          disabled={formLocked}
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
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || formLocked}
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
                </section>
              </Reveal>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
