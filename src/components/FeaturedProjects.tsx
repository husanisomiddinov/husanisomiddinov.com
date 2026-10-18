import Link from "next/link";
import { ProjectRow } from "@/components/ProjectsBrowser";
import type { Project } from "@/types";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 border-t border-gray-300 pt-2">
      <ul className="flex w-full flex-col">
        {projects.map((project, i) => (
          <ProjectRow
            key={project.slug}
            project={project}
            index={i}
            isLast={i === projects.length - 1}
          />
        ))}
      </ul>
      <Link
        href="/projects"
        className="font-sans text-sm font-medium text-gray-500 no-underline transition-colors duration-200 hover:text-brand-500"
      >
        All projects
      </Link>
    </section>
  );
}
