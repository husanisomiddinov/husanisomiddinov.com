"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { navLinks } from "@/config/nav";
import { isRouteActive } from "@/lib/routes";
import { Logo } from "@/components/Logo";
import { MenuIcon } from "@/components/icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const currentPath = usePathname();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronizing open state with the router (an external system), not derived render state.
    setOpen(false);
  }, [currentPath]);

  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex h-12 w-full items-center justify-between bg-page-bg lg:hidden">
        <div className="flex w-full items-center justify-between px-8">
          <Logo />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="flex size-8 items-center justify-center rounded text-gray-600 transition-colors duration-200 hover:text-brand-500"
              >
                <MenuIcon />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay
                className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm transition-opacity duration-300 data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
                forceMount
              />
              <Dialog.Content
                forceMount
                className="fixed top-0 right-0 z-[200] h-full w-full max-w-xs bg-page-bg px-8 pt-16 shadow-xl transition-transform duration-300 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0"
              >
                <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Site navigation links
                </Dialog.Description>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="absolute top-3 right-3 flex size-8 items-center justify-center rounded text-gray-600 transition-colors duration-200 hover:text-brand-500"
                  >
                    <span aria-hidden className="text-xl leading-none">
                      ×
                    </span>
                  </button>
                </Dialog.Close>
                <nav aria-label="Primary" className="flex flex-col items-start gap-1">
                  {navLinks.map(({ href, label }) => {
                    const isActive = isRouteActive(href, currentPath);
                    return (
                      <Link
                        key={href}
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={`block py-2 font-sans text-lg no-underline transition-colors duration-200 hover:text-brand-500 hover:no-underline ${
                          isActive ? "text-brand-500" : "text-gray-600"
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </>
  );
}
