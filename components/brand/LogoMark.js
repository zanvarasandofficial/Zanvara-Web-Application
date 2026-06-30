"use client";

import { useId } from "react";

export default function LogoMark({ sizeClassName = "h-10 w-10", iconClassName = "h-6 w-6" }) {
  const gradientId = useId();

  return (
    <div className="relative shrink-0">
      <div
        aria-hidden="true"
        className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-[#FFB347] via-[#F59E0B] to-[#FFD9A6] opacity-60 blur-sm"
      />
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] ${sizeClassName}`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,179,71,0.28),transparent_55%)]"
        />
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative ${iconClassName}`}
          aria-hidden="true"
        >
          <path
            d="M8 8H24L14 24H22"
            stroke={`url(#${gradientId})`}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 24L18 8"
            stroke={`url(#${gradientId})`}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
          <defs>
            <linearGradient
              id={gradientId}
              x1="8"
              y1="8"
              x2="24"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFD9A6" />
              <stop offset="0.5" stopColor="#FFB347" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
