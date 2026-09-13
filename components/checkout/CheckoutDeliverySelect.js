"use client";

import { formatPrice } from "../../lib/data/products";
import { formatOnlinePaymentRequirementLabel } from "../../lib/payments/delivery-payment";
import {
  formatDeliveryOptionEta,
  getDeliveryOptionCharge,
  getEnabledDeliveryOptions,
} from "../../lib/products/delivery-options";

export default function CheckoutDeliverySelect({
  product,
  value,
  onChange,
  currency,
  pkrToUsdRate,
  disabled = false,
}) {
  const options = getEnabledDeliveryOptions(product);

  if (!options.length) {
    return null;
  }

  if (options.length === 1) {
    const option = options[0];
    const charge = getDeliveryOptionCharge(option, { currency, pkrToUsdRate });

    const onlineLabel = formatOnlinePaymentRequirementLabel(option.onlinePaymentPercent);

    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
        <p className="text-sm font-medium text-white">{option.label}</p>
        <p className="mt-1 text-xs text-zinc-400">
          {charge > 0 ? formatPrice(charge) : "Free delivery"}
          {" · "}
          {formatDeliveryOptionEta(option)}
        </p>
        {onlineLabel ? (
          <p className="mt-2 text-[11px] font-medium text-sky-200/90">{onlineLabel}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const selected = value === option.id;
        const charge = getDeliveryOptionCharge(option, { currency, pkrToUsdRate });
        const onlineLabel = formatOnlinePaymentRequirementLabel(option.onlinePaymentPercent);

        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.id)}
            className={[
              "cursor-pointer rounded-2xl border px-4 py-3 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
              selected
                ? "border-[#FFB347]/45 bg-gradient-to-br from-[#FFB347]/15 to-[#F59E0B]/5 shadow-[0_0_24px_rgba(255,179,71,0.12)]"
                : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-white">{option.label}</p>
              <span
                className={[
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  charge > 0
                    ? "bg-amber-500/15 text-amber-200"
                    : "bg-emerald-500/15 text-emerald-300",
                ].join(" ")}
              >
                {charge > 0 ? formatPrice(charge) : "Free"}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-zinc-400">{formatDeliveryOptionEta(option)}</p>
            {onlineLabel ? (
              <p className="mt-2 text-[11px] font-medium text-sky-200/90">{onlineLabel}</p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
