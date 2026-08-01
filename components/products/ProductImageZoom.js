"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

function buildGalleryImages(src, hoverImage, galleryImages = []) {
  const images = [];
  const seen = new Set();

  function add(url) {
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push(url);
  }

  add(src);
  add(hoverImage);
  galleryImages.forEach(add);

  return images;
}

export default function ProductImageZoom({ src, alt, hoverImage, galleryImages = [] }) {
  const containerRef = useRef(null);
  const thumbStripRef = useRef(null);
  const touchStartX = useRef(0);
  const images = useMemo(
    () => buildGalleryImages(src, hoverImage, galleryImages),
    [src, hoverImage, galleryImages],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const activeImage = images[selectedIndex] ?? src;

  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;

    const activeThumb = strip.querySelector('[data-active-thumb="true"]');
    activeThumb?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedIndex]);

  function handleMove(event) {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = Math.max(
      0,
      Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100),
    );
    const y = Math.max(
      0,
      Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100),
    );

    setPosition({ x, y });
  }

  function handleSelect(index) {
    setSelectedIndex(index);
    setIsZooming(false);
  }

  function goToImage(index) {
    if (index < 0 || index >= images.length) return;
    handleSelect(index);
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0]?.clientX ?? 0;
  }

  function handleTouchEnd(event) {
    if (images.length <= 1) return;

    const endX = event.changedTouches[0]?.clientX ?? 0;
    const delta = endX - touchStartX.current;

    if (Math.abs(delta) < 48) return;

    if (delta < 0) {
      goToImage(Math.min(images.length - 1, selectedIndex + 1));
      return;
    }

    goToImage(Math.max(0, selectedIndex - 1));
  }

  function handleMouseEnter() {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      setIsZooming(true);
    }
  }

  function handleMouseLeave() {
    setIsZooming(false);
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <div
        ref={containerRef}
        className="relative mx-auto aspect-square w-full max-w-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:mx-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 overflow-hidden transition-transform duration-300 ease-out"
          style={{
            transform: isZooming ? "scale(1.85)" : "scale(1)",
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
        >
          <Image
            src={activeImage}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      {images.length > 1 ? (
        <div
          ref={thumbStripRef}
          className="Custom__scrollbar mt-4 flex w-full max-w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [-webkit-overflow-scrolling:touch] lg:mx-0"
        >
          {images.map((image, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                data-active-thumb={isActive ? "true" : "false"}
                onClick={() => handleSelect(index)}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={isActive}
                className={[
                  "relative h-[4.25rem] w-[4.25rem] shrink-0 snap-center overflow-hidden rounded-xl border transition-all duration-200 sm:h-16 sm:w-16",
                  isActive
                    ? "border-[#FFB347] ring-2 ring-[#FFB347]/40"
                    : "border-white/10 opacity-75 hover:border-[#FFB347]/35 hover:opacity-100",
                ].join(" ")}
              >
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover cursor-pointer"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
