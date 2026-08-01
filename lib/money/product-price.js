import { CURRENCY } from "./constants";
import { getMoneyFormatterState, formatMoney, formatUsdAmount } from "./format";
import { pkrToUsd, roundUsdForDisplay } from "./convert";

/**
 * Storefront display amounts (PKR values in API `price` / `originalPrice` are canonical for cart).
 */
export function resolveProductDisplayPrices(
  product,
  currency = getMoneyFormatterState().currency,
  rate = getMoneyFormatterState().pkrToUsdRate,
) {
  if (currency === CURRENCY.USD) {
    const manualUsd = product?.priceUsd != null && Number.isFinite(Number(product.priceUsd));
    if (manualUsd) {
      return {
        selling: Number(product.priceUsd),
        original:
          product.originalPriceUsd != null && Number.isFinite(Number(product.originalPriceUsd))
            ? Number(product.originalPriceUsd)
            : null,
        source: "manual_usd",
      };
    }

    const sellingPkr = Number(product?.price ?? 0);
    const originalPkr =
      product?.originalPrice != null ? Number(product.originalPrice) : null;

    return {
      selling: roundUsdForDisplay(pkrToUsd(sellingPkr, rate)),
      original:
        originalPkr != null && Number.isFinite(originalPkr)
          ? roundUsdForDisplay(pkrToUsd(originalPkr, rate))
          : null,
      source: "fx_fallback",
    };
  }

  return {
    selling: Number(product?.price ?? 0),
    original:
      product?.originalPrice != null ? Number(product.originalPrice) : null,
    source: "pkr",
  };
}

export function formatProductPrice(product) {
  const { selling, source } = resolveProductDisplayPrices(product);
  const currency = getMoneyFormatterState().currency;

  if (currency === CURRENCY.USD) {
    return formatUsdAmount(selling);
  }

  return formatMoney(selling);
}

export function formatProductOriginalPrice(product) {
  const { original } = resolveProductDisplayPrices(product);
  if (original == null) {
    return null;
  }

  const currency = getMoneyFormatterState().currency;
  if (currency === CURRENCY.USD) {
    return formatUsdAmount(original);
  }

  return formatMoney(original);
}

export function productUsesManualUsd(product) {
  return product?.priceUsd != null && Number.isFinite(Number(product.priceUsd));
}

export function getProductDisplayDiscountPercent(product) {
  const { selling, original } = resolveProductDisplayPrices(product);
  if (original == null || original <= selling) {
    return product?.discountPercent ?? null;
  }
  return Math.round(((original - selling) / original) * 100);
}
