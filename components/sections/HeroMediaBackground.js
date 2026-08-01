"use client";

import { useEffect, useRef } from "react";

export default function HeroMediaBackground({ mediaType = "video", mediaUrl = "" }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (mediaType !== "video" || !mediaUrl) return;

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
  }, [mediaType, mediaUrl]);

  if (!mediaUrl) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0A0A0A]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#0A0A0A] to-[#1A1A1A]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/10 to-[#0A0A0A]/85" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {mediaType === "video" ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover sm:scale-105"
        >
          <source src={mediaUrl} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover sm:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-[#0A0A0A]/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/92 via-[#0A0A0A]/55 to-[#0A0A0A]/25 md:from-[#0A0A0A]/75 md:via-[#0A0A0A]/35 md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-transparent to-[#0A0A0A]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,10,10,0.5)_100%)]" />
    </div>
  );
}
