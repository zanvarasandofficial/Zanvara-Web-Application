import Reveal from "../ui/Reveal";
import { landingIconBox } from "../../lib/ui/theme";

const perks = [
  {
    title: "Free Express Delivery",
    description: "Fast shipping on orders above Rs. 5,000 nationwide.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M3 7H15V17H3V7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M15 10H18L21 13V17H15V10Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
        <circle cx="18" cy="17.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description: "Encrypted checkout with trusted payment partners.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect
          x="3"
          y="6"
          width="18"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M3 10H21" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M7 15H11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy on eligible items.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M8 7H5V4M5 12C5 16.4 8.6 20 13 20C17.4 20 21 16.4 21 12C21 7.6 17.4 4 13 4H10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    description: "Our team is always ready to help you shop confidently.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M12 3C7.6 3 4 6.2 4 10.2C4 12.4 5 14.4 6.6 15.8L6 19L9.4 17.2C10.2 17.4 11.1 17.5 12 17.5C16.4 17.5 20 14.3 20 10.3C20 6.2 16.4 3 12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function LandingPerks() {
  return (
    <section className="border-b border-[#2A2A2A] bg-[#0A0A0A] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk, index) => (
            <Reveal key={perk.title} delay={index * 60}>
              <div className="rounded-3xl border border-[#2A2A2A] bg-[#1A1A1A] p-6 transition-all duration-300 hover:border-[#FFB347]/30 hover:bg-[#111111]">
                <div className={`mb-4 inline-flex p-3 ${landingIconBox}`}>
                  {perk.icon}
                </div>
                <h3 className="text-base font-semibold text-white">{perk.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#A3A3A3]">
                  {perk.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
