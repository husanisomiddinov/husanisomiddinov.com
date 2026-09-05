import { notFound } from "next/navigation";
import { Prose } from "@/components";
import { getAboutPage } from "@/lib/pages";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const page = await getAboutPage();
  return buildMetadata({
    title: "About | Husan Isomiddinov",
    description: page?.metadata.description,
    path: "/about",
  });
}

export default async function AboutPage() {
  const page = await getAboutPage();
  if (!page) {
    notFound();
  }

  return <Prose>{page.content}</Prose>;
}
