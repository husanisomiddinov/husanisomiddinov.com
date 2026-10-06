"use client";

import { useEffect, useState } from "react";

interface ProgressSection {
  id: string;
  label: string;
  weight: number;
}

/** Segmented reading-progress bar pinned under the nav; one segment per article section. */
export function ProjectProgressBar({
  sections,
  endId,
}: {
  sections: ProgressSection[];
  endId: string;
}) {
  const [fills, setFills] = useState<number[]>(() => sections.map(() => 0));

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY + 100;
      const top = (id: string) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      };
      const starts = sections.map((s, i) => (i === 0 ? 0 : top(s.id)));
      const endEl = document.getElementById(endId);
      const end = endEl ? top(endId) : document.documentElement.scrollHeight;

      setFills(
        starts.map((start, i) => {
          const stop = i + 1 < starts.length ? starts[i + 1] : end;
          const span = Math.max(1, stop - start);
          return Math.min(1, Math.max(0, (y - start) / span));
        }),
      );
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections, endId]);

  return (
    <nav
      aria-label="Sections"
      className="fixed top-20 left-0 z-[90] hidden h-3 w-full gap-px bg-page-bg lg:flex"
    >
      {sections.map((section, i) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          style={{ flexGrow: section.weight, flexBasis: 0 }}
          className="relative min-w-0 overflow-hidden bg-gray-200 no-underline"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 bg-brand-200"
            style={{ width: `${fills[i] * 100}%` }}
          />
          <span className="relative block truncate text-center font-sans text-[9px] leading-3 text-gray-600">
            {section.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
