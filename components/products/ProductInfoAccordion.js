"use client";

import { useId, useState } from "react";
import { hasRichTextContent, sanitizeRichTextHtml } from "../../lib/rich-text/utils";

function AccordionPanel({ id, title, html, isOpen, onToggle }) {
  const safeHtml = sanitizeRichTextHtml(html);

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-sm font-medium text-white transition-colors hover:text-zinc-200"
      >
        <span>{title}</span>
        <span
          className={[
            "shrink-0 text-zinc-400 transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        hidden={!isOpen}
        className={isOpen ? "pb-5" : "hidden"}
      >
        <div
          className="product-details-content text-sm leading-7 text-zinc-400"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
    </div>
  );
}

export default function ProductInfoAccordion({ product }) {
  const baseId = useId();
  const sections = [
    { key: "specs", title: "Specs", html: product.specsHtml },
    { key: "shipping", title: "Shipping and Returns", html: product.shippingReturnsHtml },
    { key: "included", title: "What's Included?", html: product.whatsIncludedHtml },
  ].filter((section) => hasRichTextContent(section.html));

  const [openKey, setOpenKey] = useState(() => sections[0]?.key ?? null);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-white/10 pt-2">
      {sections.map((section) => (
        <AccordionPanel
          key={section.key}
          id={`${baseId}-${section.key}`}
          title={section.title}
          html={section.html}
          isOpen={openKey === section.key}
          onToggle={() =>
            setOpenKey((current) => (current === section.key ? null : section.key))
          }
        />
      ))}
    </div>
  );
}
