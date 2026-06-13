import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  EMAIL_URL,
  WHATSAPP_URL,
} from "../../lib/data/contact";

export default function ContactLinks({ className = "" }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-zinc-300 transition-all duration-300 hover:border-emerald-500/35 hover:bg-emerald-500/10 hover:text-white"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 transition-colors group-hover:bg-emerald-500/25">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182a8.18 8.18 0 01-4.16-1.134l-.3-.178-2.868.858.858-2.868-.178-.3A8.182 8.182 0 0112 3.818c4.514 0 8.182 3.668 8.182 8.182 0 4.514-3.668 8.182-8.182 8.182z" />
          </svg>
        </span>
        <span>
          <span className="block text-xs uppercase tracking-[0.16em] text-zinc-500">
            WhatsApp
          </span>
          <span className="font-medium text-white">{CONTACT_PHONE}</span>
        </span>
      </a>

      <a
        href={EMAIL_URL}
        className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-zinc-300 transition-all duration-300 hover:border-violet-500/35 hover:bg-violet-500/10 hover:text-white"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 transition-colors group-hover:bg-violet-500/25">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <span>
          <span className="block text-xs uppercase tracking-[0.16em] text-zinc-500">
            Email
          </span>
          <span className="font-medium text-white">{CONTACT_EMAIL}</span>
        </span>
      </a>
    </div>
  );
}
