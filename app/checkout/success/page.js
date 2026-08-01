import { Suspense } from "react";
import OrderSuccessView from "../../../components/checkout/OrderSuccessView";
import { buildPageMetadata } from "../../../lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Order confirmed",
  description: "Your Zanvara order was placed successfully.",
  path: "/checkout/success",
  noIndex: true,
});

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessView />
    </Suspense>
  );
}
