import AdminEditProductPage from "../../../../../components/admin/AdminEditProductPage";

export const metadata = {
  title: "Edit Product | Zanvara Admin",
};

export default async function AdminEditProductRoute({ params }) {
  const { id } = await params;

  return <AdminEditProductPage productId={id} />;
}
