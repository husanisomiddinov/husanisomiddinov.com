import type { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

/** The site's single page-heading style. Every page title should render through this. */
export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1 className={`font-heading tracking-heading text-xl leading-snug font-bold text-gray-800 md:text-2xl ${className ?? ""}`}>
      {children}
    </h1>
  );
}
