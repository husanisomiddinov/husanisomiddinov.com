import Link from "next/link";
import { PageTitle } from "@/components";
import { ArrowRightIcon } from "@/components/icons";
import { getProjects } from "@/lib/data";
import type { Project, ProjectKind } from "@/types";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Projects | Husan Isomiddinov",
  description:
    "Things I've built and AI experiments — papers, notes, and progress over 100 days.",
  path: "/projects",
});

const KIND_ORDER: ProjectKind[] = ["robotics", "ml", "web"];
const KIND_LABEL: Record<ProjectKind, string> = {
  robotics: "Robotics",
  ml: "Machine Learning",
  web: "Web",
};

function TechChip({ label }: { label: string }) {
  return (
    <span className="rounded-md bg-gray-100 px-2 py-0.5 font-sans text-xs text-gray-600">
      {label}
    </span>
  );
}

interface ProjectGroup {
  kind: ProjectKind;
  label: string;
  items: Project[];
}

function groupProjects(projects: Project[]): ProjectGroup[] {
  return KIND_ORDER.map((kind) => ({
    kind,
    label: KIND_LABEL[kind],
    items: projects.filter((p) => p.kind === kind),
  })).filter((g) => g.items.length > 0);
}

function ProjectRow({
  project,
  isLast,
}: {
  project: Project;
  isLast: boolean;
}) {
  return (
    <div>
      <div className="group relative -mx-4 flex items-start gap-5 rounded-lg px-4 py-5 transition-colors duration-300 ease-out hover:bg-gray-800/[0.04]">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <div className="flex w-full items-start justify-between gap-3">
            <div>
              <Link
                href={`/projects/${project.slug}`}
                className="font-sans text-lg leading-snug font-bold text-gray-800 no-underline after:absolute after:inset-0 after:content-['']"
              >
                {project.title}
              </Link>
              {project.date && (
                <p className="mt-0.5 font-sans text-sm text-gray-500">
                  {project.date}
                </p>
              )}
            </div>
            <span className="shrink-0 -translate-x-1 text-gray-500 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRightIcon />
            </span>
          </div>
          <p className="line-clamp-3 text-base leading-[1.6] text-gray-600">
            {project.summary}
          </p>
          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {project.tech.map((t) => (
                <TechChip key={t} label={t} />
              ))}
            </div>
          )}
        </div>
      </div>
      {!isLast && <hr className="border-gray-300" />}
    </div>
  );
}

export default function ProjectsPage() {
  const groups = groupProjects(getProjects());

  return (
    <div className="flex w-full flex-col items-stretch gap-8">
      <div>
        <PageTitle>Projects</PageTitle>
        <p className="mt-1 text-base text-gray-600">
          Things I&apos;ve built across robotics, machine learning, and the web.
        </p>
      </div>

      <div className="flex w-full flex-col items-stretch gap-10">
        {groups.map((group) => {
          const isAi = group.kind === "ml";
          return (
            <div
              key={group.kind}
              id={isAi ? "ai-projects" : undefined}
              className={`w-full ${isAi ? "scroll-mt-20 lg:scroll-mt-24" : ""}`}
            >
              <p className="mb-2 font-sans text-sm font-semibold text-gray-500">
                {group.label}
              </p>
              <div className="flex flex-col items-stretch">
                {group.items.map((project, i) => (
                  <ProjectRow
                    key={project.slug}
                    project={project}
                    isLast={i === group.items.length - 1}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
