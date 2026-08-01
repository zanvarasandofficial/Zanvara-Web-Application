"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatCountdownLabel,
  formatCountdownParts,
  isComingSoonCountdownActive,
  parseAvailableAtMs,
} from "../../lib/products/availability";

function CountdownUnit({ value, label }) {
  return (
    <div className="flex min-w-[3.25rem] flex-col items-center rounded-xl border border-white/10 bg-black/30 px-2 py-2 sm:min-w-[3.75rem] sm:px-3">
      <span className="text-lg font-bold tabular-nums text-white sm:text-xl">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </span>
    </div>
  );
}

export default function ComingSoonCountdown({
  product,
  compact = false,
  className = "",
}) {
  const launchMs = useMemo(() => parseAvailableAtMs(product), [product]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!launchMs) {
      return undefined;
    }

    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [launchMs]);

  if (!isComingSoonCountdownActive(product, now)) {
    return null;
  }

  const remaining = Math.max(0, launchMs - now);
  const parts = formatCountdownParts(remaining);

  if (compact) {
    return (
      <p
        className={[
          "font-mono text-xs font-semibold tabular-nums text-[#FFD9A6]",
          className,
        ].join(" ")}
      >
        {formatCountdownLabel(parts)}
      </p>
    );
  }

  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Launches in
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {parts.days > 0 ? (
          <CountdownUnit value={parts.days} label="Days" />
        ) : null}
        <CountdownUnit value={String(parts.hours).padStart(2, "0")} label="Hours" />
        <CountdownUnit value={String(parts.minutes).padStart(2, "0")} label="Min" />
        <CountdownUnit value={String(parts.seconds).padStart(2, "0")} label="Sec" />
      </div>
    </div>
  );
}
