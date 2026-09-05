import { Fragment } from "react";

const socialLinks = [
  { href: "https://www.linkedin.com/in/husanisomiddinov/", label: "LinkedIn" },
  { href: "https://x.com/HusanIsamiddin", label: "Twitter" },
  { href: "https://t.me/husan_thinking", label: "Telegram" },
  { href: "https://github.com/husanisomiddinov", label: "GitHub" },
  { href: "https://hida115.substack.com/", label: "Substack" },
];

export default function SocialIcons() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
      {socialLinks.map(({ href, label }, i) => (
        <Fragment key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:no-underline"
          >
            <span className="text-base font-sans text-gray-500 transition-colors duration-200 hover:text-brand-500">
              {label}
            </span>
          </a>
          {i < socialLinks.length - 1 && (
            <span className="text-gray-300 select-none">|</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
