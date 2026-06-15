const toneStyles = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};

const statusToneMap = {
  Pending: "warning",
  Confirmed: "info",
  Shipped: "violet",
  Delivered: "success",
  Cancelled: "danger",
  Published: "success",
  Rejected: "danger",
  "Out of stock": "danger",
  Active: "success",
  Inactive: "neutral",
  Draft: "neutral",
  New: "warning",
  Read: "success",
  Contact: "info",
  Newsletter: "violet",
  "Email OTP": "info",
  Google: "violet",
  Verified: "success",
  Pending: "warning",
};

export default function StatusBadge({ status, tone }) {
  const resolvedTone = tone || statusToneMap[status] || "neutral";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${toneStyles[resolvedTone]}`}
    >
      {status}
    </span>
  );
}
