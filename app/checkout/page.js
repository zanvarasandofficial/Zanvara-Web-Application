import CheckoutView from "../../components/checkout/CheckoutView";
import { buildPageMetadata } from "../../lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Checkout",
  description: "Complete your Zanvara order with cash on delivery.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutView />;
}
