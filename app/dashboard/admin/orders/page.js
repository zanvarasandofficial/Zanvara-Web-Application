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
        description="Real checkout orders from this browser. Mark as Delivered to unlock customer reviews."
      />

      <AdminOrdersPanel />
    </>
  );
}
