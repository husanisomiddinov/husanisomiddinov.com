"use client";

import Image from "next/image";
import { useActiveItem } from "@/lib/useActiveItem";
import type { BioMilestone } from "../../content/data/personal/bio-timeline";

export function BioTimeline({ milestones }: { milestones: BioMilestone[] }) {
  const { registerItem, activeIndex } = useActiveItem(milestones.length);

  return (
    <div className="relative mt-2 flex w-full flex-col">
      {milestones.map((milestone, index) => {
        const active = index === activeIndex;

        return (
          <div key={milestone.id} className="py-5">
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
                  active ? "opacity-100" : "opacity-80"
                }`}
              >
                {milestone.content}
              </div>
              {milestone.photo && (
                <Image
                  src={milestone.photo.src}
                  alt={milestone.photo.alt}
                  width={milestone.photo.width}
                  height={milestone.photo.height}
                  sizes="(max-width: 1024px) 100vw, 660px"
                  className="mt-3 h-auto w-full rounded-lg border border-gray-200"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
