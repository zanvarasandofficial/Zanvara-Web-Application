"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import ProductCard from "../products/ProductCard";
import SectionHeading from "../ui/SectionHeading";
import { ProductSliderShimmer, PRODUCT_SLIDER_BREAKPOINTS } from "../ui/LandingShimmers";
import { SliderNav } from "../ui/SliderNav";
import Reveal from "../ui/Reveal";
import {
  bindSliderNavigation,
  configureSwiperNavigation,
} from "../../lib/swiper/bindSliderNavigation";

import "swiper/css";

export default function ProductSlider({
  eyebrow,
  title,
  subtitle,
  products = [],
  loading = false,
  emptyMessage = "No products found.",
  className = "",
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const hasProducts = products.length > 0;
  const showSlider = !loading && hasProducts;

  return (
    <section
      className={["relative overflow-hidden py-14 sm:py-16 lg:py-20 bg-[#0A0A0A]", className].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            actions={showSlider ? <SliderNav prevRef={prevRef} nextRef={nextRef} /> : null}
          />
        </Reveal>

        <Reveal delay={120}>
          {loading ? <ProductSliderShimmer /> : null}

          {!loading && !hasProducts ? (
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
                breakpoints={PRODUCT_SLIDER_BREAKPOINTS}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => configureSwiperNavigation(swiper, prevRef, nextRef)}
                onSwiper={(swiper) => bindSliderNavigation(swiper, prevRef, nextRef)}
                className="product-swiper py-2"
              >
                {products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
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
