"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Lazily loads PostHog only when an API key is configured, then captures a
 * pageview whenever the route changes. App Router has no `routeChangeComplete`
 * router event, so `usePathname`/`useSearchParams` changing is the signal.
 */
export function PostHogAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
    if (!apiKey) return;

    let disposed = false;

    import("posthog-js").then((posthog) => {
      if (disposed) return;

      if (!initialized.current) {
        initialized.current = true;
        posthog.default.init(apiKey, {
          api_host: "https://app.posthog.com",
          capture_pageview: false,
          loaded: (instance) => {
            if (process.env.NODE_ENV === "development") {
              instance.debug();
            }
          },
        });
      }

      posthog.default.capture("$pageview");
    });

    return () => {
      disposed = true;
    };
  }, [pathname, searchParams]);

  return null;
}
