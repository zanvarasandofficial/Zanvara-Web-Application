export const ORDER_STATUS = {
  PENDING: "pending",
  PRE_ORDER_CONFIRMED: "pre_order_confirmed",
  IN_PRODUCTION: "in_production",
  READY_TO_SHIP: "ready_to_ship",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const STANDARD_TRACKING_STEPS = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
];

export const PRE_ORDER_TRACKING_STEPS = [
  ORDER_STATUS.PRE_ORDER_CONFIRMED,
  ORDER_STATUS.IN_PRODUCTION,
  ORDER_STATUS.READY_TO_SHIP,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
];

export const ORDER_TRACKING_STEPS = STANDARD_TRACKING_STEPS;

export const ORDER_STATUS_INFO = {
  pending: {
    label: "Order Received",
    description: "We have received your order and it is awaiting confirmation.",
  },
  pre_order_confirmed: {
    label: "Pre-order Confirmed",
    description: "Your pre-order is confirmed. We will update you as production progresses.",
  },
  in_production: {
    label: "In Production",
    description: "Your table is being built. We will notify you when it is ready to ship.",
  },
  ready_to_ship: {
    label: "Ready to Ship",
    description: "Your order is ready. Our team will schedule courier pickup soon.",
  },
  confirmed: {
    label: "Processing at Warehouse",
    description: "Your order is being prepared and packed at our warehouse.",
  },
  shipped: {
    label: "Dispatched",
    description: "Your parcel has left our warehouse and is on its way to you.",
  },
  delivered: {
    label: "Delivered",
    description: "Your order has been successfully delivered.",
  },
  cancelled: {
    label: "Cancelled",
    description: "This order was cancelled.",
  },
};

const LEGACY_STATUS_MAP = {
  Pending: ORDER_STATUS.PENDING,
  Confirmed: ORDER_STATUS.CONFIRMED,
  Shipped: ORDER_STATUS.SHIPPED,
  Delivered: ORDER_STATUS.DELIVERED,
  Cancelled: ORDER_STATUS.CANCELLED,
};

export function normalizeOrderStatus(status) {
  if (!status) {
    return ORDER_STATUS.PENDING;
  }

  const value = String(status).trim();

  if (ORDER_STATUS_INFO[value]) {
    return value;
  }

  if (LEGACY_STATUS_MAP[value]) {
    return LEGACY_STATUS_MAP[value];
  }

  const lower = value.toLowerCase();
  if (ORDER_STATUS_INFO[lower]) {
    return lower;
  }

  return ORDER_STATUS.PENDING;
}

export function getOrderStatusLabel(status) {
  return ORDER_STATUS_INFO[normalizeOrderStatus(status)]?.label ?? "Order Received";
}

export function getOrderStatusDescription(status) {
  return (
    ORDER_STATUS_INFO[normalizeOrderStatus(status)]?.description ??
    "We are processing your order."
  );
}

export function getOrderTrackingSteps(fulfillmentKind = "standard") {
  if (fulfillmentKind === "pre_order" || fulfillmentKind === "mixed") {
    return PRE_ORDER_TRACKING_STEPS;
  }

  return STANDARD_TRACKING_STEPS;
}

export function getOrderStatusStepIndex(status, fulfillmentKind = "standard") {
  const normalized = normalizeOrderStatus(status);

  if (normalized === ORDER_STATUS.CANCELLED) {
    return -1;
  }

  const steps = getOrderTrackingSteps(fulfillmentKind);
  const index = steps.indexOf(normalized);

  if (index >= 0) {
    return index;
  }

  if (fulfillmentKind === "pre_order" || fulfillmentKind === "mixed") {
    if (normalized === ORDER_STATUS.PENDING) {
      return 0;
    }
    if (normalized === ORDER_STATUS.CONFIRMED) {
      return 1;
    }
  }

  return STANDARD_TRACKING_STEPS.indexOf(normalized);
}

export function isOrderDelivered(status) {
  return normalizeOrderStatus(status) === ORDER_STATUS.DELIVERED;
}

export function isOrderCancelled(status) {
  return normalizeOrderStatus(status) === ORDER_STATUS.CANCELLED;
}

export function isOrderStatusValue(value) {
  return Boolean(ORDER_STATUS_INFO[normalizeOrderStatus(value)]);
}

export function isPreOrderFulfillment(fulfillmentKind) {
  return fulfillmentKind === "pre_order" || fulfillmentKind === "mixed";
}
