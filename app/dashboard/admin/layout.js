import AdminLayoutClient from "../../../components/admin/AdminLayoutClient";
import { buildPageMetadata } from "../../../lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Admin",
  description: "Zanvara store administration.",
  path: "/dashboard/admin",
  noIndex: true,
});

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
