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
              {milestone.photos && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {milestone.photos.map((photo) => (
                    <Image
                      key={photo.src}
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 640px) 50vw, 320px"
                      className="h-auto w-full rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
