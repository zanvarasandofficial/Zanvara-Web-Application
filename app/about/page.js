import Link from "next/link";
import Reveal from "../../components/ui/Reveal";
import ContactLinks from "../../components/ui/ContactLinks";
import { gradientTextClass, outlineBtnClass, primaryBtnClass } from "../../lib/ui/theme";

export const metadata = {
  title: "About Us | Zanvara",
  description: "Learn how Zanvara grew into a modern e-commerce brand built on trust and quality.",
};

const milestones = [
  {
    year: "2021",
    title: "The beginning",
    text: "Zanvara started with a simple idea — make premium shopping accessible, honest, and beautifully simple for customers in Pakistan.",
  },
  {
    year: "2022",
    title: "Building trust",
    text: "We focused on verified suppliers, transparent pricing, and fast support. Word of mouth helped us grow from a small catalog to a trusted name.",
  },
  {
    year: "2023",
    title: "Scaling up",
    text: "New categories, better logistics, and a smoother checkout experience turned Zanvara into a full modern commerce platform.",
  },
  {
    year: "2024",
    title: "Today",
    text: "Thousands of happy customers, curated collections, and a team dedicated to quality — Zanvara continues to grow with you.",
  },
];

const values = [
  {
    title: "Quality first",
    text: "Every product is reviewed before it reaches our store.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 3L4 7V12C4 16.5 7.5 20.5 12 21.5C16.5 20.5 20 16.5 20 12V7L12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Customer care",
    text: "Real people, real support — on WhatsApp, email, and beyond.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 14.7614 4.52345 16.3993 5.41221 17.75L4 21L7.5 19.7C8.79445 20.4622 10.3456 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Modern experience",
    text: "Fast browsing, secure checkout, and a premium dark-first design.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 20H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 17V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden pb-16 pt-10 sm:pt-12 lg:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-16 h-80 w-80 rounded-full bg-[#FFB347]/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 rounded-full bg-[#FFB347]/5 blur-[90px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <header className="max-w-3xl">
            <p className="mb-3 inline-flex items-center rounded-full border border-[#FFB347]/25 bg-[#FFB347]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFD9A6]">
              Our Story
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Built for people who want{" "}
              <span className={gradientTextClass}>more from shopping</span>
            </h1>
            <p className="mt-4 text-base leading-8 text-[#A3A3A3] sm:text-lg">
              Zanvara was built for people who want better products, better service, and a store
              that actually feels premium — from browse to checkout to delivery.
            </p>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-[#2A2A2A] bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:mt-12 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative border-b border-[#2A2A2A] p-7 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[#FFB347]/60 via-[#FFB347]/20 to-transparent"
              />

              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B]">
                Who we are
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">More than just a store</h2>

              <div className="mt-6 space-y-5 text-sm leading-8 text-[#A3A3A3] sm:text-base">
                <p>
                  What began as a small passion project quickly grew into something bigger. We saw
                  customers struggling with unreliable sellers, unclear pricing, and outdated
                  shopping experiences — so we decided to build something better.
                </p>
                <p>
                  Zanvara grew step by step: first by curating a tight selection of high-quality
                  products, then by investing in customer support, faster delivery, and a platform
                  that feels fast, modern, and trustworthy.
                </p>
                <p>
                  Today, Zanvara is a brand built on consistency — where every order, every
                  interaction, and every new collection reflects the same promise: premium
                  commerce, done right.
                </p>
              </div>
            </div>

            <div className="p-7 sm:p-8 lg:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B]">
                What we stand for
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Our values</h2>

              <div className="mt-6 space-y-3">
                {values.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A]/50 p-4 transition-colors duration-300 hover:border-[#FFB347]/20 hover:bg-[#1A1A1A]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#FFB347]/25 bg-[#FFB347]/10 text-[#FFB347]">
                      {item.icon}
                    </span>
                    <span>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-[#A3A3A3]">{item.text}</p>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <section className="mt-14 lg:mt-16">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B]">
                Our journey
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                How we <span className={gradientTextClass}>grew</span>
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#A3A3A3] sm:text-base">
                From a small idea to a growing e-commerce brand — here is our path so far.
              </p>
            </div>

            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-[1.125rem] top-0 hidden w-px bg-gradient-to-b from-[#FFB347]/50 via-[#2A2A2A] to-transparent sm:block"
              />

              <div className="space-y-6">
                {milestones.map((item) => (
                  <div key={item.year} className="relative flex gap-5 sm:gap-8">
                    <div className="relative z-10 hidden shrink-0 sm:block">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFB347]/40 bg-[#111111] shadow-[0_0_0_6px_rgba(255,179,71,0.08)]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB347]" />
                      </span>
                    </div>

                    <article className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#111111] p-6 transition-all duration-300 hover:border-[#FFB347]/20 sm:p-7">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex rounded-full border border-[#FFB347]/25 bg-[#FFB347]/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#FFD9A6]">
                          {item.year}
                        </span>
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[#A3A3A3] sm:text-base">
                        {item.text}
                      </p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-14 overflow-hidden rounded-[2rem] border border-[#2A2A2A] bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <div className="relative border-b border-[#2A2A2A] p-7 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[#FFB347]/60 via-[#FFB347]/20 to-transparent"
              />

              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B]">
                Get in touch
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-[1.65rem]">
                Talk to our team
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-[#A3A3A3] sm:text-base">
                Have a question about an order, partnership, or product? Reach out on WhatsApp or
                email — we are always happy to help.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className={primaryBtnClass}>
                  Contact Us
                </Link>
                <Link href="/products" className={outlineBtnClass}>
                  Browse Products
                </Link>
              </div>
            </div>

            <div className="p-7 sm:p-8 lg:p-10">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B]">
                Direct channels
              </p>
              <ContactLinks />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
