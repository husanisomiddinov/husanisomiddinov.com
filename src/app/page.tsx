import { notFound } from "next/navigation";
import { Prose, SocialIcons, Experiences, CtaSection } from "@/components";
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
      <CtaSection
        className="mt-6 mb-4"
        text="From learning English at 5 to quitting Higgsfield for robots. Here is how I got here."
        href="/about"
        buttonLabel="Read about me"
        image="/images/retro-computer.png"
      />
      <Prose>
        <SocialIcons />
      </Prose>
      <hr className="mt-8 border-gray-300" />
      <Experiences experiences={experiences} />
      <CtaSection
        className="mt-12 border-t border-gray-300 pt-8"
        title="Talk with me"
        text="The most fruitful and natural exercise of our minds is, in my opinion, conversation. Oh, that's not me. Copied it from Montaigne. Anyways, grab a coffee with me)"
        href="/studio/coffee"
        buttonLabel="For a coffee chat"
        image="/images/coffee-cup.png"
      />
      <footer className="mt-12 border-t border-gray-300 pt-4 pb-2 text-center font-sans text-xs text-gray-500">
        &copy; {new Date().getFullYear()} husan &middot;{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer license"
          className="text-gray-500 no-underline hover:text-brand-500"
        >
          CC BY-NC-SA 4.0
        </a>
      </footer>
    </>
  );
}
