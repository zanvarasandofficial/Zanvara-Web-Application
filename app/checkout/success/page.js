import { Suspense } from "react";
import OrderSuccessView from "../../../components/checkout/OrderSuccessView";

export const metadata = {
  title: "Order Confirmed | Zanvara",
  description: "Your Zanvara order has been placed successfully.",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessView />
    </Suspense>
  );
}
