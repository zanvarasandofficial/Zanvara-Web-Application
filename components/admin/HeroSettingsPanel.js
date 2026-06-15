"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "./AdminPageHeader";
import {
  adminCardClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "../../lib/ui/adminStyles";
import { adminFetch, uploadHeroMedia } from "../../lib/api/admin-client";

function getMediaTypeFromFile(file) {
  return file.type.startsWith("video/") ? "video" : "image";
}

export default function HeroSettingsPanel() {
  const [hero, setHero] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHero() {
      setLoading(true);
      setError("");

      try {
        const data = await adminFetch("/admin/hero");

        if (active) {
          setHero(data);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message ?? "Could not load hero settings.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHero();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!pendingFile) {
      setPendingPreviewUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(pendingFile);
    setPendingPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [pendingFile]);

  function handleFileSelect(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setPendingFile(file);
    setError("");
    setSuccess("");
  }

  async function handleSave() {
    if (!pendingFile) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await uploadHeroMedia(pendingFile);
      setHero(updated);
      setPendingFile(null);
      setSuccess("Hero background saved to Cloudinary and database.");
    } catch (saveError) {
      setError(saveError.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const previewMediaType = pendingFile
    ? getMediaTypeFromFile(pendingFile)
    : hero?.mediaType;
  const previewUrl = pendingPreviewUrl || hero?.mediaUrl || "";
  const hasPreview = Boolean(previewUrl);

  return (
    <>
      <AdminPageHeader
        eyebrow="Landing Page"
        title="Hero Background"
        description="Choose a video or image first, preview it, then click Save to upload to Cloudinary and store the URL in MongoDB."
      />

      <section className={`${adminCardClassName} mt-8 p-6`}>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Hero media preview</h2>
          <p className="mt-1 text-sm text-slate-500">
            {pendingFile ? (
              <>
                New selection:{" "}
                <span className="font-medium capitalize">{previewMediaType}</span>
                <span className="text-amber-600"> — not saved yet</span>
              </>
            ) : (
              <>
                Saved type:{" "}
                <span className="font-medium capitalize">{hero?.mediaType ?? "—"}</span>
              </>
            )}
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
          {loading ? (
            <div className="flex min-h-56 items-center justify-center text-sm text-slate-400">
              Loading preview...
            </div>
          ) : hasPreview ? (
            previewMediaType === "video" ? (
              <video
                src={previewUrl}
                controls
                muted
                className="max-h-80 w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Hero background preview"
                className="max-h-80 w-full object-cover"
              />
            )
          ) : (
            <div className="flex min-h-56 items-center justify-center text-sm text-slate-400">
              No hero media uploaded yet.
            </div>
          )}
        </div>

        {hero?.mediaUrl && !pendingFile ? (
          <p className="mt-3 break-all text-xs text-slate-500">{hero.mediaUrl}</p>
        ) : null}

        {pendingFile ? (
          <p className="mt-3 text-xs text-slate-500">
            Selected file: <span className="font-medium text-slate-700">{pendingFile.name}</span>
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className={`${adminSecondaryButtonClassName} cursor-pointer`}>
              Upload Video or Image
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={saving}
                onChange={handleFileSelect}
              />
            </label>
            <p className="text-sm text-slate-500">
              MP4, WEBM, MOV, JPG, PNG, or WEBP — max 50MB
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!pendingFile || saving}
            className={`${adminPrimaryButtonClassName} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </section>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}
    </>
  );
}
