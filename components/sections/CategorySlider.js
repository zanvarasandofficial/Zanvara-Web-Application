"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import SectionHeading from "../ui/SectionHeading";
import { CategorySliderShimmer } from "../ui/LandingShimmers";
import { SliderNav } from "../ui/SliderNav";
import Reveal from "../ui/Reveal";
import {
  bindSliderNavigation,
  configureSwiperNavigation,
} from "../../lib/swiper/bindSliderNavigation";
import { PRODUCT_CARD_IMAGE_ASPECT, PRODUCT_SLIDER_BREAKPOINTS } from "../../lib/ui/product-card-layout";

import "swiper/css";

const sliderBreakpoints = PRODUCT_SLIDER_BREAKPOINTS;

export default function CategorySlider({
  categories = [],
  loading = false,
  emptyMessage = "No categories found.",
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const hasCategories = categories.length > 0;
  const showSlider = !loading && hasCategories;

  return (
    <section className="relative overflow-hidden py-14 sm:py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Browse Collections"
            title="Shop by Category"
            subtitle="Jump into the departments our customers love most — curated for speed and style."
            actions={showSlider ? <SliderNav prevRef={prevRef} nextRef={nextRef} /> : null}
          />
        </Reveal>

        <Reveal delay={120}>
          {loading ? <CategorySliderShimmer /> : null}

          {!loading && !hasCategories ? (
            <p className="py-8 text-center text-sm text-zinc-500">{emptyMessage}</p>
          ) : null}

          {showSlider ? (
            <div className="overflow-hidden">
              <Swiper
                modules={[Navigation, A11y]}
                spaceBetween={16}
                slidesPerView={1}
                speed={650}
                grabCursor
                watchOverflow
                breakpoints={sliderBreakpoints}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => configureSwiperNavigation(swiper, prevRef, nextRef)}
                onSwiper={(swiper) => bindSliderNavigation(swiper, prevRef, nextRef)}
                className="category-swiper py-2"
              >
                {categories.map((category) => (
                  <SwiperSlide key={category.id}>
                    <Link
                      href={`/products?category=${encodeURIComponent(category.name)}`}
                      className="group relative block overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-violet-500/25"
                    >
                      <div className={`relative ${PRODUCT_CARD_IMAGE_ASPECT} overflow-hidden`}>
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-opacity duration-500 group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <p className="text-xl font-semibold text-white">{category.name}</p>
                          <p className="mt-1 text-sm text-zinc-400">{category.count}</p>
                          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-300 transition-transform duration-300 group-hover:translate-x-1">
                            Explore
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                              <path
                                d="M9 6L15 12L9 18"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
