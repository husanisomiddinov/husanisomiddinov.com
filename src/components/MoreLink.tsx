import Link from "next/link";
import type { ReactNode } from "react";

/** The plain "All 12 posts →" link that ends a home page section. A link, not a button, so the page keeps one primary button. */
export function MoreLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded font-sans font-medium text-gray-600 no-underline transition-colors duration-200 hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${className ?? ""}`}
    >
      {children}
      <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}
