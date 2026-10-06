import { PageTitle } from "@/components";
import { ProjectsBrowser } from "@/components/ProjectsBrowser";
import { getProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Projects | Husan Isomiddinov",
  description:
    "Things I've built and AI experiments — papers, notes, and progress over 100 days.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="flex w-full flex-col items-stretch gap-8">
      <div>
        <PageTitle>Projects</PageTitle>
        <p className="mt-1 text-base text-gray-600">
          Things I&apos;ve built across robotics, machine learning, and the web.
        </p>
      </div>

      <ProjectsBrowser projects={getProjects()} />
    </div>
  );
}
