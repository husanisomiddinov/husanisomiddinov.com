/** Primary navigation links shown in the site header. */
export const navLinks = [
  { href: "/reading", label: "reading" },
  { href: "/writing", label: "writing" },
  { href: "/projects", label: "projects" },
  { href: "/studio", label: "idk" },
] as const;

/** Links shown on the 404 page — home plus the primary nav. */
export const notFoundLinks = [
  { href: "/", label: "Home" },
  ...navLinks.map((link) => ({
    href: link.href,
    label: link.label.charAt(0).toUpperCase() + link.label.slice(1),
  })),
] as const;
