import MyOrdersView from "../../../components/account/MyOrdersView";
import { buildPageMetadata } from "../../../lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "My orders",
  description: "Track your Zanvara orders and delivery status.",
  path: "/account/orders",
  noIndex: true,
});

export default function MyOrdersPage() {
  return <MyOrdersView />;
}
