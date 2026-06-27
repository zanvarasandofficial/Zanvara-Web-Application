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

      <div className="absolute inset-0 bg-[#0A0A0A]/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/15 to-[#0A0A0A]/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,10,0.45)_100%)]" />
    </div>
  );
}
