import AdminPageHeader from "../../../../components/admin/AdminPageHeader";
import StatusBadge from "../../../../components/admin/StatusBadge";
import { adminCategories } from "../../../../lib/data/admin-mock";
import {
  adminCardClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "../../../../lib/ui/adminStyles";

export const metadata = {
  title: "Categories | Zanvara Admin",
};

export default function AdminCategoriesPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Organize products into storefront categories and manage visibility."
        action={
          <button type="button" className={adminPrimaryButtonClassName}>
            Add Category
          </button>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminCategories.map((category) => (
          <article key={category.id} className={`${adminCardClassName} p-6`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{category.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{category.products} products</p>
              </div>
              <StatusBadge status={category.status} />
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" className={adminSecondaryButtonClassName}>
                Edit
              </button>
              <button type="button" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
