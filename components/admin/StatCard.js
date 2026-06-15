export default function StatCard({ label, value, change, trend = "up", note }) {
  const isUp = trend === "up";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        {change ? (
          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              isUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
            ].join(" ")}
          >
            {change}
          </span>
        ) : null}
      </div>
      {note ? <p className="mt-2 text-xs text-slate-400">{note}</p> : null}
    </article>
  );
}
