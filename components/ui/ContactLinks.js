import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  EMAIL_URL,
  WHATSAPP_URL,
} from "../../lib/data/contact";

const channels = [
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

export default function ContactLinks({ className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {channels.map((channel) => (
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
  );
}
