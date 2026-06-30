import { getOrderStatusLabel, isOrderCancelled } from "../../lib/orders/order-status";

export default function OrderDeliveredSummary({ status }) {
  if (isOrderCancelled(status)) {
    return null;
  }

  return (
    <div className="mt-6 flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M7 12L10 15L17 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-emerald-200">
          {getOrderStatusLabel(status)}
        </p>
        <p className="mt-1 text-sm leading-6 text-emerald-100/75">
          Delivery complete. Thank you for shopping with Zanvara.
        </p>
      </div>
    </div>
  );
}
