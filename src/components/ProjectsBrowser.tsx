"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import type { Project, ProjectImage, ProjectKind } from "@/types";

const KIND_ORDER: ProjectKind[] = ["robotics", "ml", "web"];
const KIND_LABEL: Record<ProjectKind, string> = {
  robotics: "Robotics",
  ml: "Machine Learning",
  web: "Web",
};

const STRIP_HEIGHT = 220;
const MAX_CHIPS = 5;

function formatDate(date?: string): string | undefined {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

type Filter = "all" | ProjectKind;

function FilterTab({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
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
      <span className="ml-1.5 font-normal text-gray-400">{count}</span>
    </button>
  );
}

function ImageStrip({ images }: { images: ProjectImage[] }) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="flex gap-2">
        {images.map((img) => (
          <div
            key={img.src}
            className="shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-200"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              quality={85}
              sizes={`${Math.round((STRIP_HEIGHT * img.width) / img.height)}px`}
              className="h-[150px] w-auto max-w-none transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:h-[220px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const images = project.cover ?? project.images ?? [];
  const tech = project.tech ?? [];
  const extra = tech.length - MAX_CHIPS;

  return (
    <li className="project-enter" style={{ animationDelay: `${index * 80}ms` }}>
      <Link
        href={`/projects/${project.slug}`}
        className="group flex flex-col gap-4 no-underline"
      >
        {images.length > 0 && <ImageStrip images={images} />}

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <h2 className="flex items-center gap-2 font-sans text-xl leading-snug font-bold text-gray-800">
              {project.title}
              <span className="text-gray-500 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                <ArrowRightIcon />
              </span>
            </h2>
            <p className="flex items-center gap-2 font-sans text-sm text-gray-500">
              {project.status === "in-progress" && (
                <span className="flex items-center gap-1.5 text-brand-500">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-brand-500"
                  />
                  in progress
                </span>
              )}
              {formatDate(project.date)}
            </p>
          </div>

          <p className="line-clamp-3 text-base leading-[1.6] text-gray-600">
            {project.summary}
          </p>

          {tech.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-1">
              {tech.slice(0, MAX_CHIPS).map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-gray-300 px-2.5 py-0.5 font-sans text-xs text-gray-600"
                >
                  {t}
                </li>
              ))}
              {extra > 0 && (
                <li className="px-1 py-0.5 font-sans text-xs text-gray-400">
                  +{extra}
                </li>
              )}
            </ul>
          )}
        </div>
      </Link>
    </li>
  );
}

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const kinds = KIND_ORDER.filter((kind) =>
    projects.some((p) => p.kind === kind),
  );
  const visible =
    filter === "all" ? projects : projects.filter((p) => p.kind === filter);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <FilterTab
          label="All"
          count={projects.length}
          isActive={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {kinds.map((kind) => (
          <FilterTab
            key={kind}
            label={KIND_LABEL[kind]}
            count={projects.filter((p) => p.kind === kind).length}
            isActive={filter === kind}
            onClick={() => setFilter(kind)}
          />
        ))}
      </div>

      <ul key={filter} className="flex w-full flex-col gap-14">
        {visible.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </ul>
    </div>
  );
}
