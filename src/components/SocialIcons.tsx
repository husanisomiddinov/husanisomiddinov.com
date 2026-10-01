import { Fragment } from "react";

const socialLinks = [
  { href: "https://www.linkedin.com/in/husanisomiddinov/", label: "LinkedIn" },
  { href: "https://x.com/HusanIsamiddin", label: "Twitter" },
  { href: "https://t.me/husan_thinking", label: "Telegram" },
  { href: "https://github.com/husanisomiddinov", label: "GitHub" },
  { href: "https://hida115.substack.com/", label: "Substack" },
];

/** Renders as plain <p>/<a> so it inherits the site's `.prose` link
 * style — meant to be nested inside <Prose>, not used standalone. */
export default function SocialIcons() {
  return (
    <p>
      {socialLinks.map(({ href, label }, i) => (
        <Fragment key={label}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
          {i < socialLinks.length - 1 && " · "}
        </Fragment>
      ))}
    </p>
  );
}
