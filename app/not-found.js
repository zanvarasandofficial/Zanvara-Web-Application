import Link from "next/link";
import { buildPageMetadata } from "../lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Page not found",
  description: "The page you are looking for could not be found on Zanvara.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">
        This link may be outdated or the product is no longer available.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A]"
      >
        Browse products
      </Link>
    </div>
  );
}
