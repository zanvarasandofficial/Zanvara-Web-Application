"use client";

import { useToast } from "../../context/ToastContext";

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-full max-w-sm flex-col gap-3 px-4 sm:bottom-6 sm:right-6 sm:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            "pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300",
            toast.type === "error"
              ? "border-red-500/30 bg-red-500/10"
              : "border-emerald-500/30 bg-emerald-500/10",
          ].join(" ")}
        >
          <span
            className={[
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              toast.type === "error" ? "bg-red-500/15 text-red-300" : "bg-emerald-500/15 text-emerald-300",
            ].join(" ")}
          >
            {toast.type === "error" ? (
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M7 12L10 15L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            )}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              {toast.type === "error" ? "Unable to add" : "Added to cart"}
            </p>
            <p className="mt-0.5 text-sm text-zinc-300">{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="cursor-pointer rounded-lg p-1 text-zinc-400 transition-colors hover:text-white"
            aria-label="Dismiss notification"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M8 8L16 16M16 8L8 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
