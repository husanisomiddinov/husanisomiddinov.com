import Link from "next/link";
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
      <section className="mt-12 flex items-center justify-between gap-6 border-t border-gray-300 pt-8">
        <div className="flex flex-col items-start gap-3">
          <h2 className="font-sans text-xl font-bold text-gray-800">Talk with me</h2>
          <p className="max-w-sm text-base text-gray-600">
            The most fruitful and natural exercise of our minds is, in my opinion, conversation. Oh, that&apos;s not me. Copied it from Montaigne. Anyways, grab a coffee with me)
          </p>
          <Link
            href="/studio/coffee"
            className="mt-1 rounded-lg bg-brand-500 px-5 py-2.5 font-sans text-sm font-bold text-brand-50 no-underline transition-colors hover:bg-brand-600"
          >
            For a coffee chat
          </Link>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/coffee-cup.png" alt="" className="w-28 shrink-0 sm:w-36" />
      </section>
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
