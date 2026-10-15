import { BioTimeline, PageTitle } from "@/components";
import { buildMetadata } from "@/lib/metadata";
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
      <BioTimeline milestones={bioMilestones} />
    </div>
  );
}
