/** Primary navigation links shown in the site header. */
export const navLinks = [
  { href: "/reading", label: "books" },
  { href: "/writing", label: "essays" },
  { href: "/projects", label: "projects" },
  { href: "/studio", label: "studio" },
] as const;

/** Links shown on the 404 page — home and about plus the primary nav. */
export const notFoundLinks = [
  { href: "/", label: "Home" },
  ...navLinks.map((link) => ({
    href: link.href,
    label: link.label.charAt(0).toUpperCase() + link.label.slice(1),
  })),
  { href: "/about", label: "About" },
] as const;
