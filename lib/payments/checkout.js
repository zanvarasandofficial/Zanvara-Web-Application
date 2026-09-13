import {
  PAYMENT_METHOD_NAME,
} from "../content/store-policy";

export const PAYMENT_METHOD_COD = PAYMENT_METHOD_NAME;

export const PAYMENT_METHOD_ONLINE = "Online Payment (Card)";

export const PAYMENT_METHOD_PARTIAL = "Partial Online + Cash on Delivery";

export const PAYMENT_ONLINE_CHECKOUT_TITLE = "Online payment";

export const PAYMENT_ONLINE_CHECKOUT_BODY =
  "Pay by card or bank transfer before we ship. After you place the order, we will send secure payment instructions by email or WhatsApp.";

export const PAYMENT_CART_NOTE_ONLINE =
  "Online payment required — we will send payment instructions after checkout.";

export const PAYMENT_PARTIAL_CHECKOUT_TITLE = "Partial online + cash on delivery";

export const PAYMENT_PARTIAL_CHECKOUT_BODY =
  "Pay the required advance online now. The remaining balance is collected on delivery.";

export const PAYMENT_FULL_ONLINE_REQUIRED_NOTE =
  "Your selected delivery option requires full online payment before we ship.";

export const PAYMENT_ORDER_SUCCESS_ONLINE =
  "Our team will confirm your order and send online payment instructions before dispatch.";

export const PRODUCT_TRUST_ONLINE_LINE = "Secure online payment for international orders";

export function isPakistanCountry(countryCode) {
  return String(countryCode || "PK").toUpperCase() === "PK";
}

export function paymentMethodFromFormValue(value) {
  if (value === "online") {
    return PAYMENT_METHOD_ONLINE;
  }
  if (value === "partial") {
    return PAYMENT_METHOD_PARTIAL;
  }
  return PAYMENT_METHOD_COD;
}

export function isOnlinePaymentMethodName(method) {
  if (!method) {
    return false;
  }
  const normalized = String(method).toLowerCase();
  return normalized.includes("online payment") || normalized.includes("card");
}

export function isPartialOnlinePaymentMethodName(method) {
  if (!method) {
    return false;
  }
  return String(method).toLowerCase().includes("partial online");
}
