import ContactForm from "../../components/contact/ContactForm";
import Reveal from "../../components/ui/Reveal";
import ContactLinks from "../../components/ui/ContactLinks";

export const metadata = {
  title: "Contact Us | Zanvara",
  description: "Get in touch with the Zanvara team via form, WhatsApp, or email.",
};

export default function ContactPage() {
  return (
    <div className="pb-10 pt-10 sm:pt-12 lg:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-3 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
              Get in Touch
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
              Questions, orders, or support — reach us anytime on WhatsApp or email.
            </p>
          </div>
        </Reveal>

        <div className="grid items-center justify-items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <Reveal delay={60}>
            <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 text-center">
              <div>
                <h2 className="text-xl font-semibold text-white">Direct contact</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-400">
                  Tap WhatsApp for instant chat or email us for detailed inquiries.
                </p>
              </div>
              <ContactLinks className="w-full" />
              <div className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
                <p className="text-sm leading-7 text-zinc-400">
                  <span className="font-medium text-zinc-200">Business hours:</span>{" "}
                  Monday – Saturday, 10:00 AM – 8:00 PM (PKT)
                </p>
              </div>
            </div>
          </Reveal>

          <ContactForm className="w-full max-w-md" />
        </div>
      </div>
    </div>
  );
}
