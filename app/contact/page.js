import ContactForm from "../../components/contact/ContactForm";
import Reveal from "../../components/ui/Reveal";
import { gradientTextClass } from "../../lib/ui/theme";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  EMAIL_URL,
  WHATSAPP_URL,
} from "../../lib/data/contact";

export const metadata = {
  title: "Contact Us | Zanvara",
  description: "Get in touch with the Zanvara team via form, WhatsApp, or email.",
};

const contactChannels = [
  {
    label: "WhatsApp",
    value: CONTACT_PHONE,
    href: WHATSAPP_URL,
    external: true,
    hint: "Fastest way to reach us",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182a8.18 8.18 0 01-4.16-1.134l-.3-.178-2.868.858.858-2.868-.178-.3A8.182 8.182 0 0112 3.818c4.514 0 8.182 3.668 8.182 8.182 0 4.514-3.668 8.182-8.182 8.182z" />
      </svg>
    ),
    iconClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/15",
  },
  {
    label: "Email",
    value: CONTACT_EMAIL,
    href: EMAIL_URL,
    external: false,
    hint: "For detailed inquiries",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    iconClass:
      "border-[#FFB347]/30 bg-[#FFB347]/10 text-[#FFD9A6] group-hover:border-[#FFB347]/50 group-hover:bg-[#FFB347]/15",
  },
];

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden pb-16 pt-10 sm:pt-12 lg:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#FFB347]/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#FFB347]/5 blur-[90px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <header className="max-w-2xl">
            <p className="mb-3 inline-flex items-center rounded-full border border-[#FFB347]/25 bg-[#FFB347]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFD9A6]">
              Get in Touch
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Let&apos;s talk —{" "}
              <span className={gradientTextClass}>we&apos;re here</span>
            </h1>
            <p className="mt-4 text-base leading-8 text-[#A3A3A3] sm:text-lg">
              Questions about an order, a product, or anything else? Message us on WhatsApp,
              email, or use the form — we&apos;ll get back to you soon.
            </p>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-[#2A2A2A] bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:mt-12 lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] xl:grid-cols-[minmax(0,24rem)_1fr]">
            <aside className="relative border-b border-[#2A2A2A] p-7 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[#FFB347]/60 via-[#FFB347]/20 to-transparent"
              />

              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B]">
                Direct channels
              </p>
              <p className="mt-2 text-sm leading-7 text-[#A3A3A3]">
                Pick the option that works best for you.
              </p>

              <div className="mt-8 space-y-3">
                {contactChannels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A]/50 p-4 transition-all duration-300 hover:border-[#FFB347]/25 hover:bg-[#1A1A1A]"
                  >
                    <span
                      className={[
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        channel.iconClass,
                      ].join(" ")}
                    >
                      {channel.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6B6B]">
                        {channel.label}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-medium text-white transition-colors group-hover:text-[#FFD9A6]">
                        {channel.value}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#6B6B6B]">{channel.hint}</span>
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 shrink-0 text-[#6B6B6B] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#FFB347]"
                      aria-hidden="true"
                    >
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A]/60 p-5">
                <p className="text-sm font-medium text-[#E5E5E5]">Quick tip</p>
                <p className="mt-1.5 text-sm leading-7 text-[#A3A3A3]">
                  For order updates, share your order ID in WhatsApp for a faster reply.
                </p>
              </div>

              {/* <p className="mt-6 text-sm leading-7 text-[#6B6B6B]">
                <span className="font-medium text-[#A3A3A3]">Business hours:</span>{" "}
                Monday – Saturday, 10:00 AM – 8:00 PM (PKT)
              </p> */}
            </aside>

            <div className="p-7 sm:p-8 lg:p-10 xl:p-12">
              <ContactForm embedded />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
