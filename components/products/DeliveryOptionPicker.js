"use client";

import { formatPrice } from "../../lib/data/products";
import {
  formatDeliveryOptionEta,
  getDeliveryOptionCharge,
  getEnabledDeliveryOptions,
} from "../../lib/products/delivery-options";

export default function DeliveryOptionPicker({
  product,
  value,
  onChange,
  currency,
  pkrToUsdRate,
  className = "",
}) {
  const options = getEnabledDeliveryOptions(product);

  if (options.length <= 1) {
    const option = options[0];
    if (!option) {
      return null;
    }

    const charge = getDeliveryOptionCharge(option, { currency, pkrToUsdRate });
    const chargeLabel = charge > 0 ? formatPrice(charge) : "Free";

    return (
      <div className={className}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Delivery
        </p>
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-sm font-medium text-white">{option.label}</p>
          <p className="mt-1 text-xs text-zinc-400">
            {chargeLabel} · {formatDeliveryOptionEta(option)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Choose delivery
      </p>
      <div className="mt-3 space-y-2">
        {options.map((option) => {
          const selected = value === option.id;
          const charge = getDeliveryOptionCharge(option, { currency, pkrToUsdRate });
          const chargeLabel = charge > 0 ? formatPrice(charge) : "Free";

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={[
                "flex w-full cursor-pointer items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-colors",
                selected
                  ? "border-[#FFB347]/40 bg-[#FFB347]/10"
                  : "border-white/10 bg-black/20 hover:border-white/20",
              ].join(" ")}
            >
              <div>
                <p className="text-sm font-medium text-white">{option.label}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Est. {formatDeliveryOptionEta(option)}
                </p>
              </div>
              <span
                className={[
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                  charge > 0
                    ? "border border-amber-500/25 bg-amber-500/10 text-amber-200"
                    : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
                ].join(" ")}
              >
                {chargeLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
