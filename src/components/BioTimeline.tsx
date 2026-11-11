"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { useActiveItem } from "@/lib/useActiveItem";
import { PhotoMarquee } from "./PhotoMarquee";
import type { BioMilestone } from "../../content/data/personal/bio-timeline";

/** Puts the mid-text photo strip after the chosen paragraph. Falls back to the end when the content is not a list of paragraphs. */
function withMidGallery(milestone: BioMilestone): ReactNode {
  const { content, midGallery, midAfter = 1 } = milestone;
  if (!midGallery) return content;
  const nodes = isValidElement<{ children?: ReactNode }>(content)
    ? Children.toArray(content.props.children)
    : [content];
  const at = Math.min(midAfter, nodes.length);
  return (
    <>
      {nodes.slice(0, at)}
      <PhotoMarquee photos={midGallery} className="my-4" />
      {nodes.slice(at)}
    </>
  );
}

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
                {withMidGallery(milestone)}
              </div>
              {milestone.gallery && (
                <PhotoMarquee photos={milestone.gallery} className="mt-3" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
