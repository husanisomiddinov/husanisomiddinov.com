"use client";

import { useState } from "react";

/** Copies the current page address, and says so for a moment. */
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused. The address bar still has the link.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="cursor-pointer rounded font-sans text-sm text-gray-500 transition-colors duration-200 hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    >
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}
