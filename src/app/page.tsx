import { notFound } from "next/navigation";
import { Prose, SocialIcons, Experiences, BioTimeline } from "@/components";
import { getHomePage } from "@/lib/pages";
import { getExperiences } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { bioMilestones } from "../../content/data/personal/bio-timeline";

export async function generateMetadata() {
  const page = await getHomePage();
  return buildMetadata({
    title: "Husan Isomiddinov",
    description: page?.metadata.description,
    path: "/",
  });
}

export default async function Home() {
  const page = await getHomePage();
  if (!page) {
    notFound();
  }

  const experiences = getExperiences();

  return (
    <>
      <Prose>{page.content}</Prose>
      <BioTimeline milestones={bioMilestones} />
      <Prose>
        <SocialIcons />
      </Prose>
      <hr className="mt-8 border-gray-300" />
      <Experiences experiences={experiences} />
    </>
  );
}
