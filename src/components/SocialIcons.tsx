const socialLinks = [
  { href: "https://x.com/HusanIsamiddin", label: "x" },
  { href: "https://hida115.substack.com/", label: "substack" },
  { href: "mailto:husanisomiddinov2006@gmail.com", label: "email" },
];

export default function SocialIcons({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Social links"
      className={`flex flex-wrap gap-x-5 gap-y-1 font-sans text-sm ${className ?? ""}`}
    >
      {socialLinks.map(({ href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 no-underline transition-colors duration-200 hover:text-brand-500"
        >
          {label} <span aria-hidden>↗</span>
        </a>
      ))}
    </nav>
  );
}
