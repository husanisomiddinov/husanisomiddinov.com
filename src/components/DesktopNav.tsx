"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/config/nav";
import { isRouteActive } from "@/lib/routes";
import { Logo } from "@/components/Logo";

export function DesktopNav() {
  const currentPath = usePathname();

  return (
    <div className="fixed top-0 left-0 z-[100] hidden h-20 w-full items-stretch justify-center bg-page-bg px-4 lg:flex lg:px-0">
      <div className="flex w-full max-w-content items-center border-b border-gray-300">
        <div className="flex w-full items-center justify-between">
          <Logo />
          <nav aria-label="Primary" className="flex items-center gap-8">
            {navLinks.map(({ href, label }) => {
              const isActive = isRouteActive(href, currentPath);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-sans text-base transition-colors duration-200 hover:text-brand-500 ${
                    isActive ? "text-brand-500" : "text-gray-600"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
