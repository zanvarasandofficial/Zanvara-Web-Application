"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { formatPrice, heroProducts } from "../../lib/data/products";
import { SliderNavButton } from "../ui/SliderNav";
import Reveal from "../ui/Reveal";
import HeroVideoBackground from "./HeroVideoBackground";

import "swiper/css";
import "swiper/css/effect-fade";

export default function HeroSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="relative overflow-hidden">
      <HeroVideoBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-[calc(4.5rem+2.5rem)] sm:px-6 sm:pb-14 sm:pt-[calc(4.5rem+3.5rem)] lg:px-8 lg:pb-16 lg:pt-[calc(4.5rem+4rem)]">
        <div className="grid items-center gap-10 lg:grid-cols-1 lg:gap-14">
          <Reveal className="max-w-2xl">
            <p className="mb-4 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
              Premium Collection 2026
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover products that{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                elevate your lifestyle
              </span>
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-400 sm:text-lg">
              From trending tech to everyday essentials — shop curated picks with
              fast delivery, secure checkout, and exclusive member deals.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:bg-right hover:shadow-[0_0_32px_rgba(139,92,246,0.35)]"
              >
                Shop All Products
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-violet-500/35 hover:bg-white/[0.07]"
              >
                View Best Deals
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-8">
              {[
                { value: "2K+", label: "Products" },
                { value: "50K+", label: "Happy Customers" },
                { value: "4.9", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160} className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/10 blur-2xl" />

            {/* <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Featured Product
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-300">
                    Swipe to explore highlights
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <SliderNavButton direction="prev" ref={prevRef} />
                  <SliderNavButton direction="next" ref={nextRef} />
                </div>
              </div>

              <Swiper
                modules={[Navigation, A11y, Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={800}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                loop
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                onSwiper={(swiper) => {
                  window.setTimeout(() => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.destroy();
                    swiper.navigation.init();
                    swiper.navigation.update();
                  });
                }}
                className="hero-product-swiper rounded-[1.4rem] overflow-hidden"
              >
                {heroProducts.map((product) => {
                  const hasDiscount =
                    product.originalPrice &&
                    product.originalPrice > product.price;

                  return (
                    <SwiperSlide key={product.id}>
                      <div className="grid overflow-hidden rounded-[1.4rem] border border-white/[0.06] bg-zinc-950/80 md:grid-cols-2">
                        <div className="relative min-h-[260px] md:min-h-[320px]">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            priority={product.id === "hero-1"}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
                          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-200 backdrop-blur-md">
                            {product.tag}
                          </span>
                        </div>

                        <div className="flex flex-col justify-center p-6 sm:p-8">
                          <h3 className="text-2xl font-semibold text-white">
                            {product.name}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-zinc-400">
                            {product.description}
                          </p>
                          <div className="mt-5 flex flex-wrap items-end gap-2">
                            <span className="text-2xl font-bold text-white">
                              {formatPrice(product.price)}
                            </span>
                            {hasDiscount ? (
                              <span className="pb-1 text-sm text-zinc-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-600 hover:via-fuchsia-600 hover:to-violet-600 hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] sm:w-auto sm:px-6"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div> */}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
