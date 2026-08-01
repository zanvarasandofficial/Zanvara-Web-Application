import CartView from "../../components/cart/CartView";
import { buildPageMetadata } from "../../lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Shopping cart",
  description: "Your Zanvara cart — review kinetic sand tables and proceed to cash-on-delivery checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return <CartView />;
}
