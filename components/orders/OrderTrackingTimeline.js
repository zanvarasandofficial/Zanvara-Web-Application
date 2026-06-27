import {
  ORDER_STATUS,
  ORDER_STATUS_INFO,
  ORDER_TRACKING_STEPS,
  getOrderStatusDescription,
  getOrderStatusLabel,
  getOrderStatusStepIndex,
  isOrderCancelled,
  normalizeOrderStatus,
} from "../../lib/orders/order-status";

const variantStyles = {
  dark: {
    card: "border-white/[0.08] bg-black/20",
    line: "bg-white/10",
    lineActive: "bg-emerald-500/70",
    dot: "border-white/15 bg-zinc-900 text-zinc-500",
    dotComplete: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    dotCurrent: "border-[#FFB347]/50 bg-[#FFB347]/20 text-[#FFD9A6] shadow-[0_0_20px_rgba(255,179,71,0.25)]",
    title: "text-white",
    titleMuted: "text-[#6B6B6B]",
    titleComplete: "text-[#FFD9A6]",
    titleCurrent: "text-[#FFB347]",
    description: "text-zinc-500",
    descriptionCurrent: "text-zinc-300",
    cancelled: "border-rose-500/20 bg-rose-500/10 text-rose-200",
  },
  light: {
    card: "border-slate-200 bg-slate-50",
    line: "bg-slate-200",
    lineActive: "bg-emerald-500",
    dot: "border-slate-200 bg-white text-slate-400",
    dotComplete: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotCurrent: "border-amber-300 bg-amber-50 text-amber-700 shadow-sm",
    title: "text-slate-900",
    titleMuted: "text-slate-400",
    titleComplete: "text-emerald-700",
    titleCurrent: "text-amber-700",
    description: "text-slate-500",
    descriptionCurrent: "text-slate-600",
    cancelled: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

function StepIcon({ step, isComplete, isCurrent }) {
  if (step === ORDER_STATUS.SHIPPED) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M3 7H15V17H3V7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M15 10H18L21 13V17H15V10Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="18" r="1.5" fill="currentColor" />
        <circle cx="18" cy="18" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  if (isComplete || isCurrent) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M7 12L10 15L17 8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return <span className="text-[11px] font-bold">•</span>;
}

export default function OrderTrackingTimeline({
  status,
  variant = "dark",
  showHeading = true,
  compact = false,
}) {
  const styles = variantStyles[variant] ?? variantStyles.dark;
  const normalized = normalizeOrderStatus(status);
  const currentIndex = getOrderStatusStepIndex(status);
  const isDelivered = normalized === ORDER_STATUS.DELIVERED;

  if (isOrderCancelled(status)) {
    return (
      <div className={`rounded-2xl border px-4 py-3 text-sm ${styles.cancelled}`}>
        {getOrderStatusLabel(status)} — {getOrderStatusDescription(status)}
      </div>
    );
  }

  return (
    <div className={compact ? "" : `rounded-2xl border p-5 ${styles.card}`}>
      {showHeading ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Fulfillment status
            </p>
            <p className={`mt-1 text-base font-semibold ${styles.title}`}>
              {getOrderStatusLabel(status)}
            </p>
          </div>
          <p className={`max-w-sm text-sm leading-6 ${styles.descriptionCurrent}`}>
            {getOrderStatusDescription(status)}
          </p>
        </div>
      ) : null}

      <ol className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
        {ORDER_TRACKING_STEPS.map((step, index) => {
          const info = ORDER_STATUS_INFO[step];
          const isComplete = isDelivered || index < currentIndex;
          const isCurrent = !isDelivered && index === currentIndex;

          return (
            <li key={step} className="relative flex flex-col items-center px-1 text-center">
              {index < ORDER_TRACKING_STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute left-[calc(50%+1.25rem)] top-5 hidden h-0.5 w-[calc(100%-2.5rem)] sm:block",
                    isComplete ? styles.lineActive : styles.line,
                  ].join(" ")}
                />
              ) : null}

              <span
                className={[
                  "relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                  isComplete
                    ? styles.dotComplete
                    : isCurrent
                      ? styles.dotCurrent
                      : styles.dot,
                ].join(" ")}
              >
                <StepIcon step={step} isComplete={isComplete} isCurrent={isCurrent} />
              </span>

              <div className="mt-3 min-w-0">
                <p
                  className={[
                    "text-xs font-semibold leading-5 sm:text-sm",
                    isComplete
                      ? styles.titleComplete
                      : isCurrent
                        ? styles.titleCurrent
                        : styles.titleMuted,
                  ].join(" ")}
                >
                  {info.label}
                </p>
                {!compact ? (
                  <p className={`mt-1 hidden text-xs leading-5 sm:block ${styles.description}`}>
                    {info.description}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
