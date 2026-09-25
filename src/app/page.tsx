import { notFound } from "next/navigation";
import { Prose, SocialIcons, Experiences } from "@/components";
import { getHomePage } from "@/lib/pages";
import { getExperiences } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

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
      <Experiences experiences={experiences} />
      <div className="mt-6 border-t border-gray-300 pt-6 text-center">
        <SocialIcons />
      </div>
    </>
  );
}
