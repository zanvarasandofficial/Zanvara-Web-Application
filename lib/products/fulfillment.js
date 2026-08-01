import {
  isComingSoonPurchaseBlocked,
} from "./availability";

export function isPreOrderProduct(product) {
  return Boolean(product?.isPreOrder);
}

export function getPreOrderSlotsRemaining(product) {
  if (!isPreOrderProduct(product)) {
    return null;
  }

  if (product.preOrderSlotsRemaining != null) {
    return Math.max(0, product.preOrderSlotsRemaining);
  }

  const capacity = product.preOrderCapacity ?? 0;
  const reserved = product.preOrderReserved ?? 0;
  return Math.max(0, capacity - reserved);
}

export function getPurchasableQuantity(product) {
  if (isComingSoonPurchaseBlocked(product)) {
    return 0;
  }

  if (isPreOrderProduct(product)) {
    return getPreOrderSlotsRemaining(product) ?? 0;
  }

  return Math.max(0, product?.stock ?? 0);
}

export function isPreOrderActive(product) {
  return isPreOrderProduct(product) && !isComingSoonPurchaseBlocked(product);
}

export function isCartLinePreOrder(item) {
  return item?.fulfillmentType === "PRE_ORDER" || Boolean(item?.isPreOrder);
}

export function formatExpectedShipFromLine(item, locale = "en-PK") {
  return formatExpectedShip(
    {
      expectedShipAt: item?.expectedShipAt,
      expectedShipNote: item?.expectedShipNote,
    },
    locale,
  );
}

export function formatExpectedShip(product, locale = "en-PK") {
  const ms = product?.expectedShipAt ? Date.parse(product.expectedShipAt) : null;
  if (ms && Number.isFinite(ms)) {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
    }).format(new Date(ms));
  }

  const note = product?.expectedShipNote?.trim();
  return note || null;
}

export function cartHasPreOrderItems(items = []) {
  return items.some((item) => item.fulfillmentType === "PRE_ORDER" || item.isPreOrder);
}

export function cartHasStandardItems(items = []) {
  return items.some(
    (item) => item.fulfillmentType !== "PRE_ORDER" && !item.isPreOrder,
  );
}

export function getCartFulfillmentKind(items = []) {
  const pre = cartHasPreOrderItems(items);
  const standard = cartHasStandardItems(items);
  if (pre && standard) {
    return "mixed";
  }
  if (pre) {
    return "pre_order";
  }
  return "standard";
}
