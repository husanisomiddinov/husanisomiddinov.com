"use client";

import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { useActiveItem } from "@/lib/useActiveItem";
import { PhotoMarquee } from "./PhotoMarquee";
import type { BioMilestone } from "../../content/data/personal/bio-timeline";

/** Interleaves the photo strips with the paragraphs, each strip after its chosen paragraph. */
function withInlineGalleries(milestone: BioMilestone): ReactNode {
  const { content, inlineGalleries } = milestone;
  if (!inlineGalleries?.length) return content;
  const nodes = isValidElement<{ children?: ReactNode }>(content)
    ? Children.toArray(content.props.children)
    : [content];
  return (
    <>
      {nodes.map((node, i) => {
        const strip = inlineGalleries.find((g) => g.after === i + 1);
        return (
          <Fragment key={i}>
            {node}
            {strip && <PhotoMarquee photos={strip.photos} className="mb-5 mt-1" />}
          </Fragment>
        );
      })}
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
                {withInlineGalleries(milestone)}
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
