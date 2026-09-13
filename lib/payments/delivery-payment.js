import { resolveCatalogProduct } from "../products/live-catalog";
import {
  normalizeOnlinePaymentPercent,
  resolveSelectedDeliveryOption,
} from "../products/delivery-options";
import { qualifiesForBuyTwoFreeDelivery } from "../products/delivery";

function roundMoney(value) {
  return Math.round(value);
}

export function getLineOnlinePaymentPercent(item, product) {
  if (item?.onlinePaymentPercent != null) {
    return normalizeOnlinePaymentPercent(item.onlinePaymentPercent);
  }

  const catalogProduct = product ?? resolveCatalogProduct({ productId: item?.productId, cartItem: item });
  const option = resolveSelectedDeliveryOption(catalogProduct, item?.deliveryOptionId);
  return normalizeOnlinePaymentPercent(option?.onlinePaymentPercent);
}

export function calculateCartPaymentRequirement(
  items = [],
  { subtotal, deliveryTotal, total, freeDeliveryMinTableQuantity },
) {
  const qualifiesForFreeDelivery = qualifiesForBuyTwoFreeDelivery(
    items,
    freeDeliveryMinTableQuantity,
  );

  let onlineDue = 0;

  for (const item of items) {
    const percent = getLineOnlinePaymentPercent(item);
    if (percent <= 0) {
      continue;
    }

    const lineSubtotal = item.price * item.quantity;
    const lineDelivery =
      !qualifiesForFreeDelivery && item.deliveryCharge > 0 ? item.deliveryCharge : 0;
    const lineTotal = lineSubtotal + lineDelivery;
    onlineDue += lineTotal * (percent / 100);
  }

  onlineDue = roundMoney(Math.min(total, onlineDue));
  const balanceOnDelivery = roundMoney(Math.max(0, total - onlineDue));

  if (onlineDue >= total - 0.01) {
    return {
      onlinePaymentDue: roundMoney(total),
      balanceOnDelivery: 0,
      mode: "full_online",
    };
  }

  if (onlineDue > 0.01) {
    return {
      onlinePaymentDue: onlineDue,
      balanceOnDelivery,
      mode: "partial_online",
    };
  }

  return {
    onlinePaymentDue: 0,
    balanceOnDelivery: roundMoney(total),
    mode: "cod_ok",
  };
}

export function formatOnlinePaymentRequirementLabel(percent) {
  const normalized = normalizeOnlinePaymentPercent(percent);
  if (normalized >= 100) {
    return "Full payment online";
  }
  if (normalized > 0) {
    return `${normalized}% online advance`;
  }
  return null;
}
