import Link from "next/link";

export default function LegalPageLayout({
  badge,
  title,
  description,
  updatedAt,
  sections,
  relatedLinks = [],
}) {
  return (
    <div className="pb-16 pt-10 sm:pt-12 lg:pt-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <header className="mb-12 border-b border-white/[0.06] pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            {badge}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-zinc-400">{description}</p>
          {updatedAt ? (
            <p className="mt-3 text-sm text-zinc-500">Last updated: {updatedAt}</p>
          ) : null}
        </header>

        <article className="space-y-10">
          {sections.map((section) => (
            <section key={section.title} id={section.id} className="scroll-mt-24">
              <h2 className="text-lg font-semibold text-white sm:text-xl">{section.title}</h2>
              <div className="mt-3 space-y-4 text-sm leading-8 text-zinc-400 sm:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list?.length ? (
                  <ul className="list-disc space-y-2 pl-5 marker:text-zinc-500">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </article>

        {relatedLinks.length ? (
          <footer className="mt-14 border-t border-white/[0.06] pt-8">
            <p className="text-sm text-zinc-500">Related</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:decoration-violet-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
