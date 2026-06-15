import AdminOrderDetailView from "../../../../../components/admin/AdminOrderDetailView";

export const metadata = {
  title: "Order Detail | Zanvara Admin",
};

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;

  return <AdminOrderDetailView orderId={id} />;
}
