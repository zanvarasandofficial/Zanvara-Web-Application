export const COLORS = {
  page: "#0A0A0A",
  section: "#111111",
  card: "#1A1A1A",
  accent: "#FFB347",
  accentHover: "#F59E0B",
  accentLight: "#FFD9A6",
  textSecondary: "#A3A3A3",
  textLight: "#E5E5E5",
  border: "#2A2A2A",
  muted: "#6B6B6B",
};

export const eyebrowClass =
  "border-[#FFB347]/25 bg-[#FFB347]/10 text-[#FFD9A6]";

export const primaryBtnClass =
  "inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,179,71,0.35)] disabled:cursor-not-allowed disabled:opacity-60";

export const outlineBtnClass =
  "inline-flex items-center justify-center rounded-2xl border border-[#FFB347]/45 bg-transparent px-6 py-3.5 text-sm font-semibold text-[#FFB347] transition-all duration-300 hover:bg-[#FFB347]/10";

export const secondaryBtnClass =
  "inline-flex items-center justify-center rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3.5 text-sm font-semibold text-[#E5E5E5] transition-all duration-300 hover:border-[#FFB347]/35 hover:bg-[#111111]";

export const ghostBtnClass =
  "inline-flex items-center justify-center rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A]/80 px-6 py-3.5 text-sm font-semibold text-[#E5E5E5] transition-all duration-300 hover:border-[#FFB347]/35 hover:bg-[#111111]";

export const cardClass =
  "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#FFB347]/35";

export const gradientTextClass =
  "bg-gradient-to-r from-[#FFD9A6] via-[#FFB347] to-[#F59E0B] bg-clip-text text-transparent";

export const sectionAltClass = "border-y border-[#2A2A2A] bg-[#111111]";

export const iconBoxClass =
  "rounded-2xl border border-[#FFB347]/25 bg-[#FFB347]/10 text-[#FFB347]";

export const accentLineClass =
  "bg-gradient-to-r from-transparent via-[#FFB347]/45 to-transparent";

export const inputClassName =
  "w-full rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#6B6B6B] focus:border-[#FFB347]/40 focus:bg-[#111111] focus:shadow-[0_0_0_4px_rgba(255,179,71,0.12)]";

export const labelClassName =
  "text-xs font-medium uppercase tracking-[0.16em] text-[#6B6B6B]";

// Backward-compatible aliases
export const LANDING = COLORS;
export const landingEyebrow = eyebrowClass;
export const landingPrimaryBtn = primaryBtnClass;
export const landingOutlineBtn = outlineBtnClass;
export const landingSecondaryBtn = secondaryBtnClass;
export const landingCard = cardClass;
export const landingGradientText = gradientTextClass;
export const landingSectionAlt = sectionAltClass;
export const landingIconBox = iconBoxClass;
export const landingAccentLine = accentLineClass;
