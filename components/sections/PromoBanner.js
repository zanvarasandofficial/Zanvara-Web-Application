import Link from "next/link";
import Reveal from "../ui/Reveal";
import { landingOutlineBtn, landingPrimaryBtn } from "../../lib/ui/theme";

export default function PromoBanner() {
  return (
    <section className="bg-[#0A0A0A] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[#FFB347]/25 bg-gradient-to-br from-[#1A1A1A] via-[#111111] to-[#0A0A0A] p-8 sm:p-10 lg:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#FFB347]/15 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFD9A6]">
                  Limited Time Offer
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Up to 40% off on selected premium products
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#A3A3A3]">
                  Upgrade your cart with exclusive deals before the season ends.
                  Fresh drops, verified quality, and member-only savings.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link href="/products" className={landingPrimaryBtn}>
                  Grab the Deals
                </Link>
                <Link href="/contact" className={landingOutlineBtn}>
                  Talk to Support
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
