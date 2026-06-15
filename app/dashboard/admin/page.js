import AdminDashboardOrdersSection from "../../../components/admin/AdminDashboardOrdersSection";
import AdminDashboardReviewsSection from "../../../components/admin/AdminDashboardReviewsSection";
import AdminDashboardStatsSection from "../../../components/admin/AdminDashboardStatsSection";
import AdminDashboardUsersSection from "../../../components/admin/AdminDashboardUsersSection";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import {
  adminTopProducts,
  formatPrice,
} from "../../../lib/data/admin-mock";
import { adminCardClassName } from "../../../lib/ui/adminStyles";

export const metadata = {
  title: "Dashboard | Zanvara Admin",
};

export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Monitor store performance, recent orders, and top-selling products."
      />

      <AdminDashboardStatsSection />

        <div className="mt-8">
          <AdminDashboardOrdersSection />
        </div>


      <AdminDashboardReviewsSection />

      <AdminDashboardUsersSection />
    </>
  );
}
