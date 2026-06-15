import AdminLayoutClient from "../../../components/admin/AdminLayoutClient";

export const metadata = {
  title: "Admin | Zanvara",
  description: "Zanvara admin panel for store management.",
};

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
