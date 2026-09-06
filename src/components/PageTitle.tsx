import type { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

/** The site's single page-heading style. Every page title should render through this. */
export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1 className={`text-lg leading-snug font-bold text-gray-800 md:text-xl ${className ?? ""}`}>
      {children}
    </h1>
  );
}
