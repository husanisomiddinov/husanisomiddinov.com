"use client";

import { useEffect, useRef, useState } from "react";
import type { BioMilestone } from "../../content/data/personal/bio-timeline";

/** Rail column width in px — keep in sync with the grid-cols value below. */
const RAIL_WIDTH = 28;

export function BioTimeline({ milestones }: { milestones: BioMilestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fillPercent, setFillPercent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Highlights whichever block is passing through the center of the
  // viewport — the same reference point the fill line's progress
  // below is measured against, so the two stay visually in sync.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = blockRefs.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (index !== -1) setActiveIndex(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    for (const el of blockRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [milestones]);

  // Continuous scroll progress for the rail's fill line, measured
  // against that same viewport-center reference point.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.5;
      const progress = (viewportCenter - rect.top) / rect.height;
      setFillPercent(Math.min(1, Math.max(0, progress)) * 100);
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
  }, []);

  return (
    <div ref={containerRef} className="relative mt-2 flex w-full flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 w-px bg-brand-500"
        style={{
          left: RAIL_WIDTH / 2,
          height: `${fillPercent}%`,
          transition: reducedMotion ? "none" : "height 150ms linear",
        }}
      />
      {milestones.map((milestone, index) => {
        const isFirst = index === 0;
        const isLast = index === milestones.length - 1;
        const active = index === activeIndex;

        return (
          <div
            key={milestone.id}
            className="grid gap-x-4 py-5"
            style={{ gridTemplateColumns: `${RAIL_WIDTH}px 1fr` }}
          >
            <div className="relative flex justify-center">
              <span
                aria-hidden
                className={`absolute left-1/2 w-px -translate-x-1/2 bg-gray-300 ${isFirst ? "top-1/2" : "top-0"} ${isLast ? "bottom-1/2" : "bottom-0"}`}
              />
              <span
                aria-hidden
                className={`relative z-10 mt-1.5 h-[9px] w-[9px] rounded-[2px] border transition-colors duration-500 ease-out ${
                  active
                    ? "border-brand-600 bg-brand-500"
                    : "border-gray-400 bg-[var(--color-page-bg)]"
                }`}
              />
            </div>
            <div
              ref={(el) => {
                blockRefs.current[index] = el;
              }}
              className="flex min-w-0 flex-col gap-1"
            >
              <p
                className={`font-sans text-sm font-bold transition-colors duration-500 ease-out ${
                  active ? "text-brand-600" : "text-gray-400"
                }`}
              >
                {milestone.dateLabel ?? milestone.age}
              </p>
              <div
                className={`prose transition-opacity duration-500 ease-out ${
                  active ? "opacity-100" : "opacity-60"
                }`}
              >
                {milestone.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
