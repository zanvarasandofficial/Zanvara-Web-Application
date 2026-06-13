"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  { r: 167, g: 139, b: 250 },
  { r: 217, g: 70, b: 239 },
  { r: 34, g: 211, b: 238 },
];

export default function FooterVideoBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frameId = 0;
    let time = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawGlowOrb(cx, cy, radius, color, alpha) {
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
      gradient.addColorStop(0.55, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.35})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }

    function drawAuroraRibbon(offset, amplitude, color, alpha) {
      ctx.beginPath();
      const segments = 8;
      const segmentWidth = width / segments;

      for (let index = 0; index <= segments; index += 1) {
        const x = index * segmentWidth;
        const wave =
          Math.sin(time * 0.55 + index * 0.85 + offset) * amplitude +
          Math.cos(time * 0.38 + index * 0.45 + offset) * (amplitude * 0.4);
        const y = height * 0.48 + wave;

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      ctx.lineWidth = 110;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.filter = "blur(32px)";
      ctx.stroke();
      ctx.filter = "none";
    }

    function draw() {
      time += prefersReducedMotion ? 0 : 0.014;
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#07070b");
      bg.addColorStop(0.5, "#0a0812");
      bg.addColorStop(1, "#050508");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const parallaxX = (mouseRef.current.x - 0.5) * 24;
      const parallaxY = (mouseRef.current.y - 0.5) * 16;

      ctx.save();
      ctx.translate(parallaxX, parallaxY);
      ctx.globalCompositeOperation = "screen";

      drawGlowOrb(
        width * (0.2 + Math.sin(time * 0.4) * 0.08),
        height * (0.35 + Math.cos(time * 0.35) * 0.06),
        Math.max(width, height) * 0.28,
        COLORS[0],
        0.2,
      );
      drawGlowOrb(
        width * (0.78 + Math.cos(time * 0.32) * 0.07),
        height * (0.55 + Math.sin(time * 0.28) * 0.08),
        Math.max(width, height) * 0.32,
        COLORS[2],
        0.16,
      );
      drawGlowOrb(
        width * (0.52 + Math.sin(time * 0.25) * 0.1),
        height * (0.62 + Math.cos(time * 0.22) * 0.05),
        Math.max(width, height) * 0.24,
        COLORS[1],
        0.14,
      );

      drawAuroraRibbon(0, 58, COLORS[0], 0.24);
      drawAuroraRibbon(1.6, 48, COLORS[2], 0.2);
      drawAuroraRibbon(3.2, 42, COLORS[1], 0.17);

      ctx.restore();
      frameId = window.requestAnimationFrame(draw);
    }

    function handleMouseMove(event) {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
    }

    resize();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="footer-ambient-bg pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.1),transparent_55%)]" />
      <div className="footer-ambient-vignette absolute inset-0" />
    </div>
  );
}
