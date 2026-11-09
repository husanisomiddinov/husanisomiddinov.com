import { BioTimeline, Gramophone, PageTitle } from "@/components";
import { buildMetadata } from "@/lib/metadata";
import { musicTracks } from "../../../content/data/personal/about-media";
import { bioMilestones } from "../../../content/data/personal/bio-timeline";

export const metadata = buildMetadata({
  title: "About",
  description: "How I got here, from age 5 to now.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col items-start">
      <PageTitle>About</PageTitle>
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-8">
        <BioTimeline milestones={bioMilestones} />
        <Gramophone
          tracks={musicTracks}
          className="w-44 shrink-0 self-center sm:order-last sm:sticky sm:top-28 sm:w-56 sm:self-start"
        />
      </div>
    </div>
  );
}
