"use client";

import { useEffect, useRef } from "react";
import { sanitizeRichTextHtml } from "../../lib/rich-text/utils";

const toolbarButtonClassName =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700";

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

export default function RichTextEditor({ value = "", onChange, placeholder }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  function syncChange() {
    const html = sanitizeRichTextHtml(editorRef.current?.innerHTML ?? "");
    onChange(html);
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

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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

        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("bold")}
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          className={`${toolbarButtonClassName} italic`}
          onClick={() => runCommand("italic")}
          aria-label="Italic"
        >
          I
        </button>
        <button
          type="button"
          className={`${toolbarButtonClassName} underline`}
          onClick={() => runCommand("underline")}
          aria-label="Underline"
        >
          U
        </button>
        <button
          type="button"
          className={`${toolbarButtonClassName} line-through`}
          onClick={() => runCommand("strikeThrough")}
          aria-label="Strikethrough"
        >
          S
        </button>

        <span className="hidden h-6 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />

        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("insertUnorderedList")}
          aria-label="Bullet list"
        >
          • List
        </button>
        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("insertOrderedList")}
          aria-label="Numbered list"
        >
          1. List
        </button>
        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("formatBlock", "blockquote")}
          aria-label="Quote"
        >
          Quote
        </button>

        <span className="hidden h-6 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />

        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("justifyLeft")}
          aria-label="Align left"
        >
          Left
        </button>
        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("justifyCenter")}
          aria-label="Align center"
        >
          Center
        </button>
        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("justifyRight")}
          aria-label="Align right"
        >
          Right
        </button>

        <span className="hidden h-6 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />

        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={handleLink}
          aria-label="Add link"
        >
          Link
        </button>
        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={handleRemoveLink}
          aria-label="Remove link"
        >
          Unlink
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

        <button
          type="button"
          className={toolbarButtonClassName}
          onClick={() => runCommand("removeFormat")}
          aria-label="Clear formatting"
        >
          Clear
        </button>
      </div>

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
