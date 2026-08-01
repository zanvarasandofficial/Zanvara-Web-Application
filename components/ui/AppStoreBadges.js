import Link from "next/link";
import { getZanvaraAppStoreUrls, ZANVARA_APP_ANCHOR } from "../../lib/content/zanvara-app";

const badgeClass =
  "inline-flex flex-1 items-center justify-center rounded-2xl border border-[#FFB347]/35 bg-[#1A1A1A] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FFB347]/55 hover:bg-[#111111] hover:shadow-[0_8px_28px_rgba(255,179,71,0.12)] sm:flex-none sm:min-w-[9.5rem]";

export default function AppStoreBadges({ className = "", compact = false }) {
  const { ios, android } = getZanvaraAppStoreUrls();
  const fallback = `/#${ZANVARA_APP_ANCHOR}`;

  if (compact) {
    return (
      <div className={["flex flex-wrap gap-2", className].join(" ")}>
        <Link href={ios || fallback} className={`${badgeClass} min-w-0 px-3 py-2 text-xs`}>
          iOS app
        </Link>
        <Link href={android || fallback} className={`${badgeClass} min-w-0 px-3 py-2 text-xs`}>
          Android app
        </Link>
      </div>
    );
  }

  return (
    <div className={["flex flex-col gap-3 sm:flex-row sm:flex-wrap", className].join(" ")}>
      <Link
        href={ios || fallback}
        target={ios ? "_blank" : undefined}
        rel={ios ? "noopener noreferrer" : undefined}
        className={`${badgeClass} flex-col gap-0.5 py-3.5`}
      >
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#A3A3A3]">
          Download on the
        </span>
        <span className="text-base leading-none">App Store</span>
      </Link>
      <Link
        href={android || fallback}
        target={android ? "_blank" : undefined}
        rel={android ? "noopener noreferrer" : undefined}
        className={`${badgeClass} flex-col gap-0.5 py-3.5`}
      >
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#A3A3A3]">
          Get it on
        </span>
        <span className="text-base leading-none">Google Play</span>
      </Link>
    </div>
  );
}
