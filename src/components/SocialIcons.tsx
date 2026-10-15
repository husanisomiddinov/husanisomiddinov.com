const socialLinks = [
  { href: "https://x.com/HusanIsamiddin", label: "Twitter" },
  { href: "https://hida115.substack.com/", label: "Substack" },
  { href: "mailto:husanisomiddinov2006@gmail.com", label: "Email" },
];

export default function SocialIcons({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Social links"
      className={`flex flex-wrap gap-x-4 gap-y-1 font-sans text-base ${className ?? ""}`}
    >
      {socialLinks.map(({ href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 underline decoration-gray-300 decoration-dotted underline-offset-4 transition-colors duration-200 hover:text-brand-500 hover:decoration-brand-500"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
