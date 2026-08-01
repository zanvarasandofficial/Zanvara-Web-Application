import { CURRENCY, DEFAULT_PKR_TO_USD_RATE } from "./constants";
import { pkrToUsd, roundUsdForDisplay } from "./convert";

const moneyState = {
  currency: CURRENCY.PKR,
  pkrToUsdRate: DEFAULT_PKR_TO_USD_RATE,
};

export function syncMoneyFormatterState(partial) {
  if (partial.currency) {
    moneyState.currency = partial.currency;
  }
  if (partial.pkrToUsdRate != null && partial.pkrToUsdRate > 0) {
    moneyState.pkrToUsdRate = partial.pkrToUsdRate;
  }
}

export function getMoneyFormatterState() {
  return { ...moneyState };
}

export function formatMoney(amountPkr, options = {}) {
  const amount = Number(amountPkr);
  if (!Number.isFinite(amount)) {
    return "—";
  }

  const currency = options.currency ?? moneyState.currency;
  const rate = options.rate ?? moneyState.pkrToUsdRate;

  if (currency === CURRENCY.USD) {
    const usd = roundUsdForDisplay(pkrToUsd(amount, rate));
    return formatUsdAmount(usd);
  }

  return `Rs. ${Math.round(amount).toLocaleString("en-PK")}`;
}

export function formatUsdAmount(amountUsd) {
  const amount = Number(amountUsd);
  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/** @deprecated use formatMoney — kept for existing imports */
export function formatPrice(amountPkr) {
  return formatMoney(amountPkr);
}
