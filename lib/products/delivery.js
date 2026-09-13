import { DEFAULT_FREE_DELIVERY_MIN_TABLES } from "../content/store-policy";
import {
  buildBuyTwoApplied,
  buildBuyTwoCartHint,
  buildBuyTwoPromoShort,
} from "../content/store-policy-copy";
import { formatPrice } from "./pricing";
import {
  formatDeliveryOptionEta,
  getDefaultDeliveryOption,
  getDeliveryOptionCharge,
  resolveProductDeliveryOptions,
  resolveSelectedDeliveryOption,
} from "./delivery-options";

export const PRODUCT_DELIVERY_FREE_ITEM = "Free delivery on this item";

export function getLineDeliveryOption(item, product) {
  return resolveSelectedDeliveryOption(product ?? item, item?.deliveryOptionId);
}

export function getProductDeliveryCharge(product, optionId) {
  const option = resolveSelectedDeliveryOption(product, optionId);
  return option?.charge ?? 0;
}

export function getLineDeliveryCharge(item, product, pricingContext) {
  const option = getLineDeliveryOption(item, product);
  if (!option) {
    return 0;
  }

  if (pricingContext) {
    return getDeliveryOptionCharge(option, pricingContext);
  }

  return option.charge;
}

export function formatDeliveryLabel(product, optionId) {
  const charge = getProductDeliveryCharge(product, optionId);

  if (charge > 0) {
    return formatPrice(charge);
  }

  return "Free";
}

export function formatLineDeliveryLabel(item, product, pricingContext) {
  const charge = getLineDeliveryCharge(item, product, pricingContext);

  if (charge > 0) {
    return formatPrice(charge);
  }

  return "Free";
}

export function isFreeDelivery(product, optionId) {
  return getProductDeliveryCharge(product, optionId) === 0;
}

export function getCartUnitQuantity(items = []) {
  return items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

export function qualifiesForBuyTwoFreeDelivery(
  items = [],
  minQuantity = DEFAULT_FREE_DELIVERY_MIN_TABLES,
) {
  return getCartUnitQuantity(items) >= minQuantity;
}

export function calculateCartDeliveryTotalWithoutPromo(items = [], pricingContext) {
  return items.reduce(
    (total, item) => total + getLineDeliveryCharge(item, item, pricingContext),
    0,
  );
}

export function calculateCartDeliveryTotal(
  items = [],
  minQuantity = DEFAULT_FREE_DELIVERY_MIN_TABLES,
  pricingContext,
) {
  if (qualifiesForBuyTwoFreeDelivery(items, minQuantity)) {
    return 0;
  }

  return calculateCartDeliveryTotalWithoutPromo(items, pricingContext);
}

export function getCartDeliverySummary(
  items = [],
  minQuantity = DEFAULT_FREE_DELIVERY_MIN_TABLES,
  pricingContext,
) {
  const wouldCharge = calculateCartDeliveryTotalWithoutPromo(items, pricingContext);
  const qualifies = qualifiesForBuyTwoFreeDelivery(items, minQuantity);
  const total = qualifies ? 0 : wouldCharge;
  const units = getCartUnitQuantity(items);

  let note = null;
  if (qualifies) {
    note = buildBuyTwoApplied(minQuantity);
  } else if (wouldCharge > 0 && units > 0 && units < minQuantity) {
    note = buildBuyTwoCartHint(minQuantity, units);
  }

  return {
    total,
    qualifies,
    note,
    displayLabel: total > 0 ? formatPrice(total) : "Free",
  };
}

export function formatProductDeliveryTrustLine(
  product,
  minQuantity = DEFAULT_FREE_DELIVERY_MIN_TABLES,
  optionId,
) {
  const option = resolveSelectedDeliveryOption(product, optionId);

  if (!option || option.charge <= 0) {
    return PRODUCT_DELIVERY_FREE_ITEM;
  }

  return `Delivery from ${formatPrice(option.charge)} (${buildBuyTwoPromoShort(minQuantity)})`;
}

export function formatLineDeliverySummary(item, product, pricingContext) {
  const option = getLineDeliveryOption(item, product);
  if (!option) {
    return null;
  }

  const chargeLabel = formatLineDeliveryLabel(item, product, pricingContext);
  const eta = formatDeliveryOptionEta(option);

  return {
    label: option.label,
    chargeLabel,
    eta,
    isFree: chargeLabel === "Free",
  };
}

export function getProductDeliveryOptions(product) {
  return resolveProductDeliveryOptions(product);
}

export function getDefaultProductDeliveryOption(product) {
  return getDefaultDeliveryOption(product);
}
