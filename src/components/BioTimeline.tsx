"use client";

import { useScrollRail } from "@/lib/useScrollRail";
import type { BioMilestone } from "../../content/data/personal/bio-timeline";

/** Rail column width in px - keep in sync with the grid-cols value below. */
const RAIL_WIDTH = 28;

export function BioTimeline({ milestones }: { milestones: BioMilestone[] }) {
  const { containerRef, registerItem, activeIndex, fillPercent, reducedMotion } =
    useScrollRail(milestones.length);

  return (
    <div ref={containerRef} className="relative mt-2 flex w-full flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 z-[1] w-px bg-brand-500"
        style={{
          left: RAIL_WIDTH / 2,
          height: `${fillPercent}%`,
          transform: "translateX(-50%)",
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
            <div ref={registerItem(index)} className="flex min-w-0 flex-col gap-1">
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
