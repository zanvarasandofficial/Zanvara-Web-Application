"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function ProductImageZoom({ src, alt, hoverImage }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

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

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div
        ref={containerRef}
        className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/[0.08] bg-zinc-950"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onMouseMove={handleMove}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />

        {active ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 bg-white/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)] lg:block"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
          />
        ) : null}
      </div>

      <div
        aria-hidden={!active}
        className={[
          "relative hidden aspect-square overflow-hidden rounded-[2rem] border border-white/[0.08] bg-zinc-950 lg:block",
          active ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat transition-opacity duration-200"
          style={{
            backgroundImage: `url(${hoverImage || src})`,
            backgroundSize: "220%",
            backgroundPosition: `${position.x}% ${position.y}%`,
          }}
        />
      </div>

      {hoverImage ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-zinc-950 lg:col-span-2">
          <Image
            src={hoverImage}
            alt={`${alt} alternate view`}
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
