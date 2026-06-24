"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "./AdminPageHeader";
import StatusBadge from "./StatusBadge";
import { adminFetch, uploadCategoryImage } from "../../lib/api/admin-client";
import {
  adminCardClassName,
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "../../lib/ui/adminStyles";

const emptyForm = {
  name: "",
};

export default function AdminCategoriesPanel() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  async function loadCategories() {
    setLoading(true);
    setError("");

    try {
      const data = await adminFetch("/admin/categories");
      setCategories(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message ?? "Could not load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  function openCreateModal() {
    setEditingCategory(null);
    setForm(emptyForm);
    setImageFile(null);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(category) {
    setEditingCategory(category);
    setForm({ name: category.name });
    setImageFile(null);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setImageFile(null);
  }

  async function handleSave(event) {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      setError("Category heading is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let savedCategory = editingCategory;

      if (editingCategory) {
        savedCategory = await adminFetch(`/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      } else {
        savedCategory = await adminFetch("/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      }

      if (imageFile && savedCategory?.id) {
        savedCategory = await uploadCategoryImage(savedCategory.id, imageFile);
      }

      await loadCategories();
      setSuccess(editingCategory ? "Category updated." : "Category added.");
      closeModal();
    } catch (saveError) {
      setError(saveError.message ?? "Could not save category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(`Delete "${category.name}"?`);

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await adminFetch(`/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      setSuccess("Category deleted.");
      await loadCategories();
    } catch (deleteError) {
      setError(deleteError.message ?? "Could not delete category.");
    }
  }

  const previewImage =
    imagePreviewUrl || editingCategory?.imageUrl || "/icon.svg";

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Manage storefront category headings and images. Product counts update automatically from published products."
        action={
          <button type="button" className={adminPrimaryButtonClassName} onClick={openCreateModal}>
            Add Category
          </button>
        }
      />

      {error ? (
        <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-8 text-sm text-slate-500">Loading categories...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article key={category.id} className={`${adminCardClassName} overflow-hidden`}>
              <div className="relative aspect-[4/3] bg-slate-100">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    No image yet
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{category.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {category.productCount} product{category.productCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <StatusBadge status={category.status} />
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    className={adminSecondaryButtonClassName}
                    onClick={() => openEditModal(category)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    onClick={() => handleDelete(category)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className={`${adminCardClassName} w-full max-w-lg p-6`}>
            <h2 className="text-xl font-semibold text-slate-900">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Set the heading and image shown on the landing page category slider.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSave}>
              <label className="flex flex-col gap-2">
                <span className={adminLabelClassName}>Heading</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ name: event.target.value })}
                  placeholder="Electronics"
                  className={adminInputClassName}
                />
              </label>

              <div className="space-y-2">
                <span className={adminLabelClassName}>Image</span>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <Image
                    src={previewImage}
                    alt="Category preview"
                    fill
                    sizes="480px"
                    className="object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-violet-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className={adminSecondaryButtonClassName} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={adminPrimaryButtonClassName}>
                  {saving ? "Saving..." : editingCategory ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
