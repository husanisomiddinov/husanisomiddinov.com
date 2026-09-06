import Link from "next/link";
import type { ReactNode } from "react";

interface BackLinkProps {
  href: string;
  children: ReactNode;
}

/** The site's single "← back to X" link style, used atop detail pages. */
export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="font-sans text-sm text-gray-500 no-underline hover:text-brand-500"
    >
      {children}
    </Link>
  );
}
