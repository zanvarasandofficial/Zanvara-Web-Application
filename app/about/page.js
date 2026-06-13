import Link from "next/link";
import Reveal from "../../components/ui/Reveal";
import ContactLinks from "../../components/ui/ContactLinks";

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
  },
  {
    title: "Customer care",
    text: "Real people, real support — on WhatsApp, email, and beyond.",
  },
  {
    title: "Modern experience",
    text: "Fast browsing, secure checkout, and a premium dark-first design.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-10 pt-10 sm:pt-12 lg:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
              Our Story
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              About Zanvara
            </h1>
            <p className="mt-4 text-base leading-8 text-zinc-400 sm:text-lg">
              Zanvara was built for people who want more from online shopping — better products,
              better service, and a store that actually feels premium.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal delay={80}>
            <div className="space-y-6 text-sm leading-8 text-zinc-400 sm:text-base">
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
                Today, Zanvara is more than a store. It is a brand built on consistency — where
                every order, every interaction, and every new collection reflects the same promise:
                premium commerce, done right.
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
                >
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">How we grew</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              From a small idea to a growing e-commerce brand — here is our journey so far.
            </p>

            <div className="mt-10 space-y-5">
              {milestones.map((item, index) => (
                <div
                  key={item.year}
                  className="relative rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-7"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                    <span className="inline-flex w-fit rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-sm font-semibold text-violet-200">
                      {item.year}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-zinc-400 sm:text-base">
                        {item.text}
                      </p>
                    </div>
                  </div>
                  {index < milestones.length - 1 ? (
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-5 left-8 hidden h-5 w-px bg-gradient-to-b from-violet-500/40 to-transparent sm:block"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-16 grid gap-8 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white">Talk to our team</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
                Have a question about an order, partnership, or product? Reach out on WhatsApp
                or email — we are always happy to help.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-violet-500/35 hover:bg-white/[0.07]"
              >
                Go to Contact Page
              </Link>
            </div>
            <ContactLinks />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
