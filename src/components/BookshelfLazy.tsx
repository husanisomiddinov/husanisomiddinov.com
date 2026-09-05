"use client";

import dynamic from "next/dynamic";

// `ssr:false` dynamic imports must live behind a Client Component boundary in
// the App Router — Server Components can't call them directly. Keeping
// Bookshelf out of the initial SSR HTML is a deliberate perf choice carried
// over from the old repo (see docs/perf-baseline.md): it's the heaviest
// component on the site (3D transforms + next/image srcsets per book).
export const BookshelfLazy = dynamic(
  () => import("@/components/Bookshelf").then((m) => m.Bookshelf),
  { ssr: false }
);
