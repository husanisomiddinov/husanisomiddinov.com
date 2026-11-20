import { notFound } from "next/navigation";
import { Prose, SocialIcons, Experiences, FeaturedProjects, FeaturedWriting, FeaturedBooks, CtaSection } from "@/components";
import { getHomePage } from "@/lib/pages";
import { getExperiences, getFeaturedProjects, getProjects } from "@/lib/data";
import { getAllWritingMetadata } from "@/lib/posts";
import { getAllBooks, getFeaturedBooks } from "@/lib/books";
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
  const featuredProjects = getFeaturedProjects();
  const allWriting = getAllWritingMetadata();
  const featuredWriting = allWriting.filter((p) => p.featured);
  const featuredBooks = getFeaturedBooks();

  return (
    <>
      <Prose>{page.content}</Prose>
      <CtaSection
        className="mt-6"
        text="From learning English at 5 to quitting Higgsfield for robots. My humble story..."
        href="/about"
        buttonLabel="Read about me"
        image="/images/samarkand.webp"
      />
      <SocialIcons className="mt-3" />
      <hr className="mt-8 border-gray-300" />
      <Experiences experiences={experiences} />
      <FeaturedProjects projects={featuredProjects} total={getProjects().length} />
      <FeaturedWriting posts={featuredWriting} total={allWriting.length} />
      <FeaturedBooks books={featuredBooks} total={getAllBooks().length} />
      <CtaSection
        className="mt-12 border-t border-gray-300 pt-8"
        title="Talk with me"
        text="The most fruitful and natural exercise of our minds is, in my opinion, conversation. I copied the quote from Montaigne to sound fancy when I invite someone for a coffeechat. Anyways, let's grab something together!"
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
