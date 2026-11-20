import { MoreLink } from "@/components/MoreLink";
import { ProjectRow } from "@/components/ProjectsBrowser";
import type { Project } from "@/types";

export function FeaturedProjects({
  projects,
  total,
}: {
  projects: Project[];
  /** Size of the full list, shown in the link to it. */
  total: number;
}) {
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
      <MoreLink href="/projects" className="mt-5">
        All {total} projects
      </MoreLink>
    </section>
  );
}
