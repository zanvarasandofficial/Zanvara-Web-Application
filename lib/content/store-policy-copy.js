import {
  DELIVERY_TIMELINE,
  DEFAULT_FREE_DELIVERY_MIN_TABLES,
} from "./store-policy";

export function buildBuyTwoFreeDeliveryMessage(minQty = DEFAULT_FREE_DELIVERY_MIN_TABLES) {
  const min = Math.max(1, minQty);
  return `Order ${min} or more kinetic tables in one order and delivery is free.`;
}

export function buildBuyTwoPerkTitle(minQty = DEFAULT_FREE_DELIVERY_MIN_TABLES) {
  const min = Math.max(1, minQty);
  return `Free delivery on ${min} table${min === 1 ? "" : "s"}`;
}

export function buildBuyTwoPromoShort(minQty = DEFAULT_FREE_DELIVERY_MIN_TABLES) {
  const min = Math.max(1, minQty);
  return `Free delivery when you order ${min}+ tables`;
}

export function buildBuyTwoApplied(minQty = DEFAULT_FREE_DELIVERY_MIN_TABLES) {
  const min = Math.max(1, minQty);
  return `Free delivery applied — ${min}+ tables in your order.`;
}

export function buildBuyTwoCartHint(
  minQty = DEFAULT_FREE_DELIVERY_MIN_TABLES,
  currentUnits = 0,
) {
  const min = Math.max(1, minQty);
  const remaining = Math.max(0, min - currentUnits);
  if (remaining <= 0) {
    return null;
  }
  if (remaining === 1) {
    return "Add one more table to this order for free delivery nationwide.";
  }
  return `Add ${remaining} more tables to this order for free delivery nationwide.`;
}

export function buildFaqDeliveryAnswer(minQty = DEFAULT_FREE_DELIVERY_MIN_TABLES) {
  return `${DELIVERY_TIMELINE} ${buildBuyTwoFreeDeliveryMessage(minQty)}`;
}

export function buildStorePolicyCopy(minQty = DEFAULT_FREE_DELIVERY_MIN_TABLES) {
  const min = Math.max(1, minQty);
  return {
    freeDeliveryMinTableQuantity: min,
    buyTwoFreeDelivery: buildBuyTwoFreeDeliveryMessage(min),
    buyTwoPerkTitle: buildBuyTwoPerkTitle(min),
    buyTwoPerkBody: buildBuyTwoFreeDeliveryMessage(min),
    buyTwoPromoShort: buildBuyTwoPromoShort(min),
    buyTwoApplied: buildBuyTwoApplied(min),
    faqDelivery: buildFaqDeliveryAnswer(min),
  };
}
