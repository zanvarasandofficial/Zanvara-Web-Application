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
        className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050505]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-[#050505] to-fuchsia-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/10 to-[#050505]/80" />
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
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        >
          <source src={mediaUrl} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaUrl}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
      )}

      <div className="absolute inset-0 bg-[#050505]/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/10 to-[#050505]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,5,0.35)_100%)]" />
    </div>
  );
}
