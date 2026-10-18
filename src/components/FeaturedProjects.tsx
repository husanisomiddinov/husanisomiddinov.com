import { Button } from "@/components/Button";
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
      <Button href="/projects" className="mt-4">
        All projects &rarr;
      </Button>
    </section>
  );
}
