"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { isHttpUrl } from "@/lib/url";
import type { Project, ProjectImage, ProjectKind } from "@/types";

const KIND_ORDER: ProjectKind[] = ["robotics", "ml", "web"];
const KIND_LABEL: Record<ProjectKind, string> = {
  robotics: "Robotics",
  ml: "Machine Learning",
  web: "Web",
};
const LINK_LABELS: Record<string, string> = {
  github: "GitHub",
  live: "Live",
  twitter: "Twitter",
};

const MAX_THUMBS = 5;
const MAX_TECH = 3;

type Filter = "all" | ProjectKind;

function formatDate(date?: string): string | undefined {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

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

/** One row of thumbnails sized by aspect ratio so they share a height and fill the card width. */
function Thumbnails({ images }: { images: ProjectImage[] }) {
  return (
    <div className="flex w-full gap-2">
      {images.map((img) => (
        <div
          key={img.src}
          style={{ flexGrow: img.width / img.height, flexBasis: 0 }}
          className="min-w-0 rounded-md border border-gray-300 bg-brand-50 p-1"
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            quality={80}
            sizes="(max-width: 700px) 30vw, 180px"
            className="h-auto w-full rounded-[3px]"
          />
        </div>
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const images = (project.images ?? []).slice(0, MAX_THUMBS);
  const captions = images.map((img) => img.caption).filter(Boolean);
  const tech = project.tech ?? [];
  const links = Object.entries(project.links ?? {}).filter(
    (entry): entry is [string, string] =>
      typeof entry[1] === "string" && isHttpUrl(entry[1]),
  );
  const meta = [
    formatDate(project.date),
    ...tech.slice(0, MAX_TECH),
    tech.length > MAX_TECH ? `+${tech.length - MAX_TECH}` : null,
  ].filter(Boolean);

  return (
    <li className="project-enter" style={{ animationDelay: `${index * 80}ms` }}>
      <article className="group relative -mx-4 flex flex-col gap-3 rounded-lg px-4 py-6 transition-colors duration-300 ease-out hover:bg-gray-800/[0.03]">
        <h2 className="font-sans text-xl leading-snug font-bold text-gray-800">
          <Link
            href={`/projects/${project.slug}`}
            className="text-gray-800 no-underline after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h2>

        <p className="flex flex-wrap items-center gap-x-2 font-sans text-sm text-gray-500">
          {project.status === "in-progress" && (
            <>
              <span className="flex items-center gap-1.5 text-brand-500">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-brand-500"
                />
                in progress
              </span>
              <span aria-hidden>·</span>
            </>
          )}
          {meta.map((item, i) => (
            <Fragment key={`${item}-${i}`}>
              {i > 0 && <span aria-hidden>·</span>}
              <span>{item}</span>
            </Fragment>
          ))}
        </p>

        <p className="text-base leading-[1.6] text-gray-600">
          {project.summary}
        </p>

        {images.length > 0 && (
          <>
            <Thumbnails images={images} />
            {captions.length > 0 && (
              <p className="font-sans text-sm text-gray-500">
                {captions.join(" · ")}
              </p>
            )}
          </>
        )}

        <div className="relative z-10 flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 bg-gray-900 px-3 py-1.5 font-sans text-sm text-brand-50 no-underline transition-colors duration-200 hover:bg-brand-700"
          >
            View project
            <ArrowRightIcon className="size-3.5" />
          </Link>
          {links.map(([key, href]) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-medium text-brand-500 lowercase no-underline hover:text-brand-600 hover:underline"
            >
              {LINK_LABELS[key] ?? key}
            </a>
          ))}
        </div>
      </article>
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
    <div className="flex w-full flex-col gap-6">
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

      <ul key={filter} className="flex w-full flex-col">
        {visible.map((project, i) => (
          <Fragment key={project.slug}>
            {i > 0 && <hr className="border-gray-300" />}
            <ProjectCard project={project} index={i} />
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
