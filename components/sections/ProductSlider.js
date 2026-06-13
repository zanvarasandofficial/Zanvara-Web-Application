"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import ProductCard from "../products/ProductCard";
import SectionHeading from "../ui/SectionHeading";
import { SliderNav } from "../ui/SliderNav";
import Reveal from "../ui/Reveal";

import "swiper/css";

const sliderBreakpoints = {
  640: { slidesPerView: 2, spaceBetween: 20 },
  1024: { slidesPerView: 3, spaceBetween: 24 },
  1280: { slidesPerView: 4, spaceBetween: 24 },
};

function bindSliderNavigation(swiper, prevRef, nextRef) {
  swiper.params.navigation.prevEl = prevRef.current;
  swiper.params.navigation.nextEl = nextRef.current;

  window.setTimeout(() => {
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  });
}

export default function ProductSlider({
  eyebrow,
  title,
  subtitle,
  products,
  className = "",
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section
      className={["relative overflow-hidden py-14 sm:py-16 lg:py-20", className].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            actions={<SliderNav prevRef={prevRef} nextRef={nextRef} />}
          />
        </Reveal>

        <Reveal delay={120}>
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
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
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
        </Reveal>
      </div>
    </section>
  );
}
