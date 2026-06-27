export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  actions = null,
  align = "left",
}) {
  return (
    <div
      className={[
        "mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between",
        align === "center" ? "text-center md:text-left" : "",
      ].join(" ")}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 inline-flex items-center rounded-full border border-[#FFB347]/25 bg-[#FFB347]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFD9A6]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-base leading-7 text-[#A3A3A3] sm:text-lg">{subtitle}</p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  );
}
