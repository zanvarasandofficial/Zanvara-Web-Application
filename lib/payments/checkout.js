import {
  PAYMENT_METHOD_NAME,
} from "../content/store-policy";

export const PAYMENT_METHOD_COD = PAYMENT_METHOD_NAME;

export const PAYMENT_METHOD_ONLINE = "Online Payment (Card)";

export const PAYMENT_ONLINE_CHECKOUT_TITLE = "Online payment";

export const PAYMENT_ONLINE_CHECKOUT_BODY =
  "Pay by card or bank transfer before we ship. After you place the order, we will send secure payment instructions by email or WhatsApp.";

export const PAYMENT_CART_NOTE_ONLINE =
  "Online payment required — we will send payment instructions after checkout.";

export const PAYMENT_ORDER_SUCCESS_ONLINE =
  "Our team will confirm your order and send online payment instructions before dispatch.";

export const PRODUCT_TRUST_ONLINE_LINE = "Secure online payment for international orders";

export function isPakistanCountry(countryCode) {
  return String(countryCode || "PK").toUpperCase() === "PK";
}

export function paymentMethodFromFormValue(value) {
  return value === "online" ? PAYMENT_METHOD_ONLINE : PAYMENT_METHOD_COD;
}

export function isOnlinePaymentMethodName(method) {
  if (!method) {
    return false;
  }
  const normalized = String(method).toLowerCase();
  return normalized.includes("online payment") || normalized.includes("card");
}
