import { DEFAULT_FREE_DELIVERY_MIN_TABLES } from "../content/store-policy";
import {
  buildBuyTwoApplied,
  buildBuyTwoCartHint,
  buildBuyTwoPromoShort,
} from "../content/store-policy-copy";
import { formatPrice } from "./pricing";

export const PRODUCT_DELIVERY_FREE_ITEM = "Free delivery on this item";

export function getProductDeliveryCharge(product) {
  if (product?.deliveryType === "CHARGED" && product?.deliveryCharge > 0) {
    return product.deliveryCharge;
  }

  return 0;
}

export function formatDeliveryLabel(product) {
  const charge = getProductDeliveryCharge(product);

  if (charge > 0) {
    return formatPrice(charge);
  }

  return "Free";
}

export function isFreeDelivery(product) {
  return getProductDeliveryCharge(product) === 0;
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

export function calculateCartDeliveryTotalWithoutPromo(items = []) {
  return items.reduce((total, item) => total + getProductDeliveryCharge(item), 0);
}

export function calculateCartDeliveryTotal(
  items = [],
  minQuantity = DEFAULT_FREE_DELIVERY_MIN_TABLES,
) {
  if (qualifiesForBuyTwoFreeDelivery(items, minQuantity)) {
    return 0;
  }

  return calculateCartDeliveryTotalWithoutPromo(items);
}

export function getCartDeliverySummary(
  items = [],
  minQuantity = DEFAULT_FREE_DELIVERY_MIN_TABLES,
) {
  const wouldCharge = calculateCartDeliveryTotalWithoutPromo(items);
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
) {
  if (isFreeDelivery(product)) {
    return PRODUCT_DELIVERY_FREE_ITEM;
  }

  return `Delivery: ${formatDeliveryLabel(product)} (${buildBuyTwoPromoShort(minQuantity)})`;
}
