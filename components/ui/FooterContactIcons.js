import { EMAIL_URL, INSTAGRAM_URL, WHATSAPP_URL } from "../../lib/data/contact";

const contactIcons = [
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182a8.18 8.18 0 01-4.16-1.134l-.3-.178-2.868.858.858-2.868-.178-.3A8.182 8.182 0 0112 3.818c4.514 0 8.182 3.668 8.182 8.182 0 4.514-3.668 8.182-8.182 8.182z" />
      </svg>
    ),
    hoverClass:
      "hover:border-emerald-500/35 hover:text-emerald-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.22)]",
    glowClass: "from-emerald-500/15 to-teal-500/10",
  },
  {
    label: "Email",
    href: EMAIL_URL,
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    hoverClass:
      "hover:border-[#FFB347]/35 hover:text-[#FFD9A6] hover:shadow-[0_0_20px_rgba(255,179,71,0.22)]",
    glowClass: "from-[#FFB347]/15 to-[#F59E0B]/10",
  },
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
    hoverClass:
      "hover:border-pink-500/35 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.22)]",
    glowClass: "from-pink-500/15 to-fuchsia-500/10",
  },
];

export default function FooterContactIcons({ className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {contactIcons.map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          aria-label={contact.label}
          target={contact.external ? "_blank" : undefined}
          rel={contact.external ? "noopener noreferrer" : undefined}
          className={[
            "group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:text-white",
            contact.hoverClass,
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "absolute inset-0 rounded-full bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              contact.glowClass,
            ].join(" ")}
          />
          <span className="relative">{contact.icon}</span>
        </a>
      ))}
    </div>
  );
}
