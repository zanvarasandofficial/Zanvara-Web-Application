import AdminPageHeader from "../../../../components/admin/AdminPageHeader";
import AdminReviewsPanel from "../../../../components/admin/AdminReviewsPanel";

export const metadata = {
  title: "Reviews | Zanvara Admin",
};

export default function AdminReviewsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Reputation"
        title="Reviews"
        description="Moderate verified reviews from customers whose orders were delivered."
      />
      <AdminReviewsPanel />
    </>
  );
}
