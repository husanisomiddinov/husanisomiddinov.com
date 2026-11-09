/** Primary navigation links shown in the site header. */
export const navLinks = [
  { href: "/reading", label: "Reading" },
  { href: "/writing", label: "Writing" },
  { href: "/projects", label: "Projects" },
  { href: "/studio", label: "Idk" },
] as const;

/** Links shown on the 404 page - home plus the primary nav. */
export const notFoundLinks = [
  { href: "/", label: "Home" },
  ...navLinks,
] as const;
