"use client";

import { useState } from "react";
import Link from "next/link";
import { DIAGRAM_PREVIEWS } from "@/components/diagrams";
import type { Project, ProjectKind } from "@/types";

const KIND_ORDER: ProjectKind[] = ["robotics", "ml", "web"];
const KIND_LABEL: Record<ProjectKind, string> = {
  robotics: "Robotics",
  ml: "Machine learning",
  web: "Web",
};

type Filter = "all" | ProjectKind;

/** Filters on a short list read as product UI, so they only appear once there is enough to sort. */
const MIN_PROJECTS_FOR_FILTERS = 8;

function formatDate(date?: string): string | undefined {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function FilterTab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`border-b pb-1 font-sans text-sm font-medium transition-colors duration-200 hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2 ${
        isActive
          ? "border-brand-500 text-brand-500"
          : "border-transparent text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

/** Live previews of the project page's animated diagrams, sized by aspect so they share a height. */
function DiagramPreviews({ names }: { names: string[] }) {
  const previews = names.flatMap((name) => {
    const preview = DIAGRAM_PREVIEWS[name];
    return preview ? [{ name, ...preview }] : [];
  });
  if (previews.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none flex w-full gap-2 pt-1">
      {previews.map(({ name, Component, aspect }) => (
        <div
          key={name}
          style={{ flexGrow: aspect, flexBasis: 0 }}
          className="min-w-0 rounded-lg border border-gray-200 bg-brand-50 p-2"
        >
          <Component />
        </div>
      ))}
    </div>
  );
}

export function ProjectRow({
  project,
  isLast,
  index,
}: {
  project: Project;
  isLast: boolean;
  index: number;
}) {
  const date = formatDate(project.date);

  return (
    <li className="project-enter" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="group relative flex items-start gap-5 py-5">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <div className="flex w-full items-start justify-between gap-3">
            <div>
              <Link
                href={`/projects/${project.slug}`}
                className="font-sans text-lg leading-snug font-bold text-gray-800 no-underline transition-colors duration-200 group-hover:text-brand-500 after:absolute after:inset-0 after:content-['']"
              >
                {project.title}
              </Link>
              {date && (
                <p className="mt-0.5 font-sans text-sm text-gray-500">{date}</p>
              )}
            </div>
          </div>
          <p className="line-clamp-3 text-prose text-gray-600">
            {project.summary}
          </p>
          {project.previews && <DiagramPreviews names={project.previews} />}
          {project.tech && project.tech.length > 0 && (
            <p className="pt-0.5 font-sans text-sm text-gray-500">
              {project.tech.join(" · ")}
            </p>
          )}
        </div>
      </div>
      {!isLast && <hr className="border-gray-300" />}
    </li>
  );
}

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const kinds = KIND_ORDER.filter((kind) =>
    projects.some((p) => p.kind === kind),
  );
  const showFilters =
    projects.length >= MIN_PROJECTS_FOR_FILTERS && kinds.length > 1;
  const visible =
    !showFilters || filter === "all"
      ? projects
      : projects.filter((p) => p.kind === filter);

  return (
    <div className="flex w-full flex-col gap-6">
      {showFilters && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <FilterTab
            label="All"
            isActive={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {kinds.map((kind) => (
            <FilterTab
              key={kind}
              label={KIND_LABEL[kind]}
              isActive={filter === kind}
              onClick={() => setFilter(kind)}
            />
          ))}
        </div>
      )}

      <ul key={filter} className="flex w-full flex-col">
        {visible.map((project, i) => (
          <ProjectRow
            key={project.slug}
            project={project}
            index={i}
            isLast={i === visible.length - 1}
          />
        ))}
      </ul>
    </div>
  );
}
