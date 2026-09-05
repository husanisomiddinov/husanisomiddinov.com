import { notFound } from "next/navigation";
import { Prose, SocialIcons } from "@/components";
import { getHomePage } from "@/lib/pages";
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

  return (
    <>
      <Prose>{page.content}</Prose>
      <div className="mt-6 border-t border-gray-300 pt-6 text-center">
        <SocialIcons />
      </div>
    </>
  );
}
