import { DEFAULT_PKR_TO_USD_RATE } from "./constants";

export function pkrToUsd(amountPkr, rate = DEFAULT_PKR_TO_USD_RATE) {
  if (rate <= 0) {
    return 0;
  }
  return amountPkr / rate;
}

export function usdToPkr(amountUsd, rate = DEFAULT_PKR_TO_USD_RATE) {
  return amountUsd * rate;
}

export function roundUsdForDisplay(amountUsd) {
  return Math.round(amountUsd);
}
