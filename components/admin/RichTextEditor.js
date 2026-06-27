"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { uploadProductImage } from "../../lib/api/admin-client";
import {
  buildImageSizeStyle,
  normalizeImageDimension,
  sanitizeRichTextHtml,
} from "../../lib/rich-text/utils";

const toolbarButtonClassName =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#FFB347]/30 hover:bg-[#FFB347]/10 hover:text-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60";

const sizeInputClassName =
  "w-24 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/20";

const selectClassName =
  "min-w-[220px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 outline-none focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/20";

const colorOptions = [
  { label: "Default", value: "#0f172a" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Rose", value: "#e11d48" },
  { label: "Emerald", value: "#059669" },
  { label: "Amber", value: "#d97706" },
  { label: "Sky", value: "#0284c7" },
];

const headingOptions = [
  { label: "Normal text", value: "p" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
];

const imageSizePresets = [
  { label: "Small", width: "240px", height: "auto" },
  { label: "Medium", width: "420px", height: "auto" },
  { label: "Large", width: "640px", height: "auto" },
  { label: "Full", width: "100%", height: "auto" },
];

function readImageDimensions(image) {
  if (!image) {
    return { width: "100%", height: "auto" };
  }

  const style = image.getAttribute("style") ?? "";
  const widthMatch = style.match(/width:\s*([^;]+)/i);
  const heightMatch = style.match(/height:\s*([^;]+)/i);
  const widthAttr = image.getAttribute("width");
  const heightAttr = image.getAttribute("height");

  const width = widthMatch?.[1]?.trim() || (widthAttr ? `${widthAttr}px` : "100%");
  const height = heightMatch?.[1]?.trim() || (heightAttr ? `${heightAttr}px` : "auto");

  return { width, height };
}

function collectEditorImages(root) {
  if (!root) return [];

  return [...root.querySelectorAll("img")].map((image, index) => {
    const dimensions = readImageDimensions(image);
    const alt = image.getAttribute("alt")?.trim() || `Image ${index + 1}`;

    return {
      index,
      alt,
      src: image.getAttribute("src") ?? "",
      width: dimensions.width,
      height: dimensions.height,
    };
  });
}

export default function RichTextEditor({ value = "", onChange, placeholder }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editorImages, setEditorImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState("");
  const [imageWidth, setImageWidth] = useState("100%");
  const [imageHeight, setImageHeight] = useState("auto");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
      refreshImageList();
    }
  }, [value]);

  const selectedImage = useMemo(
    () => editorImages.find((image) => String(image.index) === selectedImageIndex) ?? null,
    [editorImages, selectedImageIndex],
  );

  function refreshImageList() {
    const images = collectEditorImages(editorRef.current);
    setEditorImages(images);

    if (images.length === 0) {
      setSelectedImageIndex("");
      return;
    }

    const stillExists = images.some((image) => String(image.index) === selectedImageIndex);
    const nextIndex = stillExists ? selectedImageIndex : String(images[images.length - 1].index);
    setSelectedImageIndex(nextIndex);

    const active = images.find((image) => String(image.index) === nextIndex);
    if (active) {
      setImageWidth(active.width);
      setImageHeight(active.height);
    }
  }

  function syncChange() {
    const html = sanitizeRichTextHtml(editorRef.current?.innerHTML ?? "");
    onChange(html);
    refreshImageList();
  }

  function getImageElementByIndex(index) {
    const images = editorRef.current?.querySelectorAll("img");
    if (!images?.length) return null;
    return images[Number(index)] ?? null;
  }

  function runCommand(command, commandValue) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncChange();
  }

  function handleInput() {
    syncChange();
  }

  function handlePaste(event) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    syncChange();
  }

  function handleLink() {
    const url = window.prompt("Enter link URL (https://...)");
    if (!url) return;

    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      window.alert("Please enter a valid URL starting with http:// or https://");
      return;
    }

    runCommand("createLink", trimmed);
  }

  function handleRemoveLink() {
    runCommand("unlink");
  }

  function handleSelectImage(event) {
    const nextIndex = event.target.value;
    setSelectedImageIndex(nextIndex);

    const image = editorImages.find((item) => String(item.index) === nextIndex);
    if (image) {
      setImageWidth(image.width);
      setImageHeight(image.height);
    }
  }

  function applyImageSize(width, height, index = selectedImageIndex) {
    if (index === "") {
      window.alert("Pehle dropdown se image select karein.");
      return;
    }

    const image = getImageElementByIndex(index);
    if (!image) {
      window.alert("Selected image editor mein nahi mili.");
      refreshImageList();
      return;
    }

    const nextWidth = normalizeImageDimension(width, "100%");
    const nextHeight = normalizeImageDimension(height, "auto");

    image.setAttribute("style", buildImageSizeStyle(nextWidth, nextHeight));
    image.removeAttribute("width");
    image.removeAttribute("height");
    image.classList.add("rich-text-image");

    setImageWidth(nextWidth);
    setImageHeight(nextHeight);
    syncChange();
  }

  function handleApplyImageSize() {
    applyImageSize(imageWidth, imageHeight);
  }

  function handlePresetSize(preset) {
    setImageWidth(preset.width);
    setImageHeight(preset.height);
    applyImageSize(preset.width, preset.height);
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please choose a JPG, PNG, or WEBP image.");
      return;
    }

    setUploadingImage(true);

    try {
      const result = await uploadProductImage(file);
      const alt =
        window.prompt("Image name / description (optional)", "Product detail image")?.trim() ||
        "Product detail image";
      const safeAlt = alt.replace(/"/g, "'");
      const sizeStyle = buildImageSizeStyle("100%", "auto");
      const imgHtml = `<p><img src="${result.url}" alt="${safeAlt}" class="rich-text-image" style="${sizeStyle}" /></p>`;

      editorRef.current?.focus();
      document.execCommand("insertHTML", false, imgHtml);
      syncChange();

      const images = collectEditorImages(editorRef.current);
      const lastImage = images[images.length - 1];
      if (lastImage) {
        setSelectedImageIndex(String(lastImage.index));
        setImageWidth(lastImage.width);
        setImageHeight(lastImage.height);
      }
    } catch (uploadError) {
      window.alert(uploadError.message ?? "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2.5">
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
          Style
          <select
            className="cursor-pointer bg-transparent text-sm text-slate-800 outline-none"
            defaultValue=""
            onChange={(event) => {
              const block = event.target.value;
              if (!block) return;
              runCommand("formatBlock", block);
              event.target.value = "";
            }}
          >
            <option value="">Pick</option>
            {headingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <span className="hidden h-6 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />

        <button type="button" className={toolbarButtonClassName} onClick={() => runCommand("bold")}>
          B
        </button>
        <button
          type="button"
          className={`${toolbarButtonClassName} italic`}
          onClick={() => runCommand("italic")}
        >
          I
        </button>
        <button
          type="button"
          className={`${toolbarButtonClassName} underline`}
          onClick={() => runCommand("underline")}
        >
          U
        </button>
        <button
          type="button"
          className={`${toolbarButtonClassName} line-through`}
          onClick={() => runCommand("strikeThrough")}
        >
          S
        </button>

        <span className="hidden h-6 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />

        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("insertUnorderedList")}
        >
          • List
        </button>
        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("insertOrderedList")}
        >
          1. List
        </button>
        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("formatBlock", "blockquote")}
        >
          Quote
        </button>

        <span className="hidden h-6 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />

        <button type="button" className={toolbarButtonClassName} onClick={() => runCommand("justifyLeft")}>
          Left
        </button>
        <button type="button" className={toolbarButtonClassName} onClick={() => runCommand("justifyCenter")}>
          Center
        </button>
        <button type="button" className={toolbarButtonClassName} onClick={() => runCommand("justifyRight")}>
          Right
        </button>

        <span className="hidden h-6 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />

        <button type="button" className={toolbarButtonClassName} onClick={handleLink}>
          Link
        </button>
        <button type="button" className={toolbarButtonClassName} onClick={handleRemoveLink}>
          Unlink
        </button>
        <button
          type="button"
          className={toolbarButtonClassName}
          disabled={uploadingImage}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadingImage ? "..." : "Image"}
        </button>

        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
          Color
          <select
            className="cursor-pointer bg-transparent text-sm text-slate-800 outline-none"
            defaultValue=""
            onChange={(event) => {
              const color = event.target.value;
              if (!color) return;
              runCommand("foreColor", color);
              event.target.value = "";
            }}
          >
            <option value="">Pick</option>
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className={toolbarButtonClassName} onClick={() => runCommand("removeFormat")}>
          Clear
        </button>
      </div>

      {editorImages.length > 0 ? (
        <div className="space-y-3 border-b border-slate-200 bg-[#FFB347]/10/60 px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Select image
              <select
                value={selectedImageIndex}
                onChange={handleSelectImage}
                className={selectClassName}
              >
                {editorImages.map((image) => (
                  <option key={image.index} value={String(image.index)}>
                    Image {image.index + 1} — {image.alt}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Size
            </span>
            <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
              Width
              <input
                type="text"
                value={imageWidth}
                onChange={(event) => setImageWidth(event.target.value)}
                placeholder="100%"
                className={sizeInputClassName}
              />
            </label>
            <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
              Height
              <input
                type="text"
                value={imageHeight}
                onChange={(event) => setImageHeight(event.target.value)}
                placeholder="auto"
                className={sizeInputClassName}
              />
            </label>
            <button type="button" className={toolbarButtonClassName} onClick={handleApplyImageSize}>
              Apply size
            </button>
            {imageSizePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={toolbarButtonClassName}
                onClick={() => handlePresetSize(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {selectedImage ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 text-sm text-slate-600">
                <p className="font-medium text-slate-900">{selectedImage.alt}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Current size: {selectedImage.width} × {selectedImage.height}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Use px or % — e.g. <span className="font-medium">420px</span>,{" "}
                  <span className="font-medium">100%</span>, height{" "}
                  <span className="font-medium">auto</span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        className="rich-text-editor min-h-40 px-4 py-4 text-sm leading-7 text-slate-800 outline-none"
      />
    </div>
  );
}
