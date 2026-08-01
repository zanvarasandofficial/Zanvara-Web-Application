import Link from "next/link";
import Reveal from "../ui/Reveal";
import AppStoreBadges from "../ui/AppStoreBadges";
import { landingOutlineBtn } from "../../lib/ui/theme";
import {
  ZANVARA_APP_ANCHOR,
  zanvaraAppFeatureHighlights,
  zanvaraAppShortDescription,
} from "../../lib/content/zanvara-app";

export default function PromoBanner() {
  return (
    <section
      id={ZANVARA_APP_ANCHOR}
      className="scroll-mt-24 bg-[#0A0A0A] py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[#FFB347]/25 bg-gradient-to-br from-[#1A1A1A] via-[#111111] to-[#0A0A0A] p-8 sm:p-10 lg:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#FFB347]/15 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFD9A6]">
                  Free mobile app
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Control your table from iOS &amp; Android
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#A3A3A3]">
                  {zanvaraAppShortDescription}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {zanvaraAppFeatureHighlights.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-full border border-[#FFB347]/25 bg-[#FFB347]/10 px-3 py-1.5 text-xs font-medium text-[#FFD9A6]"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <AppStoreBadges />
                <Link href="/contact" className={`${landingOutlineBtn} w-full justify-center`}>
                  Need help connecting?
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
