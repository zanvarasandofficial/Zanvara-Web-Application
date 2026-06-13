"use client";

import { useEffect, useRef } from "react";

export default function HeroVideoBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      // Autoplay may be blocked until user interaction.
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full scale-105 object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#050505]/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/10 to-[#050505]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,5,0.35)_100%)]" />
    </div>
  );
}
