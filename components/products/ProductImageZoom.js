"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

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
  const images = useMemo(
    () => buildGalleryImages(src, hoverImage, galleryImages),
    [src, hoverImage, galleryImages],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const activeImage = images[selectedIndex] ?? src;

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

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative mx-auto aspect-square w-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:mx-0"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMove}
      >
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
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

        {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/35 to-transparent px-4 py-3">
          <p className="text-xs text-zinc-300">
            {isZooming ? "Move cursor to explore details" : "Hover to zoom in place"}
          </p>
        </div> */}
      </div>

      {images.length > 1 ? (
        <div className="mx-auto mt-4 flex w-full gap-3 overflow-x-auto pb-3 lg:mx-0 Custom__scrollbar">
          {images.map((image, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => handleSelect(index)}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={isActive}
                className={[
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-all duration-200",
                  isActive
                    ? "border-violet-500 ring-2 ring-violet-500/40"
                    : "border-white/10 opacity-75 hover:border-violet-500/35 hover:opacity-100",
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
