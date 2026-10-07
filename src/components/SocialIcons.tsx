import { Fragment } from "react";

const socialLinks = [
  { href: "https://x.com/HusanIsamiddin", label: "Twitter" },
  { href: "https://hida115.substack.com/", label: "Substack" },
  { href: "mailto:husanisomiddinov2006@gmail.com", label: "Email" },
];

/** Renders as plain <p>/<a> so it inherits the site's `.prose` link
 * style - meant to be nested inside <Prose>, not used standalone. */
export default function SocialIcons() {
  return (
    <p className="text-center">
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
