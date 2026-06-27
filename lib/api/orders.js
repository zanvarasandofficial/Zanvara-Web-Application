import { customerFetch } from "./customer-auth";

function sanitizeOrderPayload(payload) {
  return {
    subtotal: payload.subtotal,
    deliveryTotal: payload.deliveryTotal,
    total: payload.total,
    paymentMethod: payload.paymentMethod,
    customer: payload.customer,
    items: (payload.items ?? []).map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}

export async function createOrder(payload) {
  return customerFetch("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanitizeOrderPayload(payload)),
  });
}

export async function fetchMyOrders() {
  return customerFetch("/orders/me");
}
