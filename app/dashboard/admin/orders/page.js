import AdminOrdersPanel from "../../../../components/admin/AdminOrdersPanel";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader";

export const metadata = {
  title: "Orders | Zanvara Admin",
};

export default function AdminOrdersPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Sales"
        title="Orders"
        description="Track fulfillment from warehouse dispatch to delivery. Update status so customers can follow their parcel."
      />

      <AdminOrdersPanel />
    </>
  );
}
