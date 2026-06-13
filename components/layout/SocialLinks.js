const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M7 17L16 7M9 7H16V14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M4 8.5C4 7.1 5.1 6 6.5 6H17.5C18.9 6 20 7.1 20 8.5V15.5C20 16.9 18.9 18 17.5 18H6.5C5.1 18 4 16.9 4 15.5V8.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M10 9.5L15 12L10 14.5V9.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 10V16M8 8V8.01M12 16V12.5C12 11.1 13.1 10 14.5 10C15.9 10 17 11.1 17 12.5V16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/35 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.22)]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/15 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="relative">{social.icon}</span>
        </a>
      ))}
    </div>
  );
}
