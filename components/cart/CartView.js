"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { USD_FOOTER_NOTE } from "../../lib/content/international-pricing";
import { useCurrency } from "../../context/CurrencyContext";
import { formatPrice } from "../../lib/data/products";
import {
  formatExpectedShipFromLine,
  isCartLinePreOrder,
} from "../../lib/products/fulfillment";
import { PAYMENT_CART_NOTE_PK } from "../../lib/content/store-policy";
import {
  PAYMENT_CART_NOTE_ONLINE,
} from "../../lib/payments/checkout";
import {
  PRE_ORDER_CART_CHIP,
  PRE_ORDER_CART_NOTE,
  PRE_ORDER_MIXED_CART,
  PRE_ORDER_SLOTS_LEFT,
} from "../../lib/content/pre-order";
import { resolveCatalogProduct } from "../../lib/products/live-catalog";
import { getProductPath } from "../../lib/products/paths";
import Reveal from "../ui/Reveal";

export default function CartView() {
  const {
    items,
    subtotal,
    fulfillmentKind,
    updateQuantity,
    removeItem,
  } = useCart();
  const { isInternationalDisplay, isPakistanVisitor } = useCurrency();
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
              const catalogProduct = resolveCatalogProduct({
                productId: item.productId,
                cartItem: item,
              });
              const isPreOrderLine = isCartLinePreOrder(item);
              const expectedShip = isPreOrderLine ? formatExpectedShipFromLine(item) : null;
              const productHref = getProductPath(catalogProduct);

              return (
              <Reveal key={item.productId} delay={index * 40}>
                <article className="grid gap-4 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:grid-cols-[120px_minmax(0,1fr)] sm:p-5">
                  <Link
                    href={productHref}
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
                          href={productHref}
                          className="text-lg font-semibold text-white transition-colors hover:text-[#FFD9A6]"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-zinc-500">
                          {isPreOrderLine
                            ? PRE_ORDER_SLOTS_LEFT(item.stock)
                            : `${item.stock} available in stock`}
                        </p>
                        {expectedShip ? (
                          <p className="mt-1 text-xs text-amber-200/90">
                            Est. ship: {expectedShip}
                          </p>
                        ) : null}
                        {isPreOrderLine ? (
                          <p className="mt-2 inline-flex rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-200">
                            {PRE_ORDER_CART_CHIP}
                          </p>
                        ) : null}
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

              {fulfillmentKind === "pre_order" || fulfillmentKind === "mixed" ? (
                <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <p className="text-sm font-semibold text-amber-100">Pre-order in cart</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">{PRE_ORDER_CART_NOTE}</p>
                  {fulfillmentKind === "mixed" ? (
                    <p className="mt-2 text-xs leading-5 text-zinc-500">{PRE_ORDER_MIXED_CART}</p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs leading-5 text-zinc-500">
                  Delivery speed and charges are selected at checkout.
                </p>
                <div className="border-t border-white/[0.06] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">Total</span>
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    {isPakistanVisitor
                      ? PAYMENT_CART_NOTE_PK
                      : PAYMENT_CART_NOTE_ONLINE}
                  </p>
                  {isInternationalDisplay ? (
                    <p className="mt-2 text-xs leading-5 text-zinc-500">{USD_FOOTER_NOTE}</p>
                  ) : null}
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
