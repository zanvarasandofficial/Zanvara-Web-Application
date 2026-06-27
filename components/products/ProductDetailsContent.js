"use client";

import { hasRichTextContent, sanitizeRichTextHtml } from "../../lib/rich-text/utils";
import Reveal from "../ui/Reveal";

export default function ProductDetailsContent({ detailsHtml }) {
  if (!hasRichTextContent(detailsHtml)) {
    return null;
  }

  const safeHtml = sanitizeRichTextHtml(detailsHtml);

  if (!hasRichTextContent(safeHtml)) {
    return null;
  }

  return (
    <Reveal delay={120}>
      <section className="mt-14 border-t border-white/[0.06] pt-12">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
            Product Details
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            More about this item
          </h2>
        </div>

        <div
          className="product-details-content rounded-[1.75rem] border border-white/[0.08] px-6 py-6 sm:px-8 sm:py-8"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </section>
    </Reveal>
  );
}
