import { formatPrice } from "./pricing";

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

export function calculateCartDeliveryTotal(items = []) {
  return items.reduce((total, item) => total + getProductDeliveryCharge(item), 0);
}
