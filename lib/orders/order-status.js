export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ORDER_TRACKING_STEPS = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
];

export const ORDER_STATUS_INFO = {
  pending: {
    label: "Order Received",
    description: "We have received your order and it is awaiting confirmation.",
  },
  confirmed: {
    label: "Processing at Warehouse",
    description: "Your order is being prepared and packed at our warehouse.",
  },
  shipped: {
    label: "Dispatched from Warehouse",
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

export function getOrderStatusStepIndex(status) {
  const normalized = normalizeOrderStatus(status);

  if (normalized === ORDER_STATUS.CANCELLED) {
    return -1;
  }

  return ORDER_TRACKING_STEPS.indexOf(normalized);
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
