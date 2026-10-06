import { Fragment } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BackLink } from "@/components";
import { siteUrl } from "@/config/site";
import { getAllProjectSlugs, getProject } from "@/lib/data";
import { isHttpUrl } from "@/lib/url";
import type { ProjectImage } from "@/types";
import { buildMetadata } from "@/lib/metadata";

type DescriptionBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

const LINK_LABELS: Record<string, string> = {
  github: "GitHub",
  live: "Live",
  twitter: "Twitter",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  if (!isoMatch) return dateStr;
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function parseDescriptionBlocks(description?: string): DescriptionBlock[] {
  const text = (description ?? "").trim();
  if (!text) return [];

  const blocks: DescriptionBlock[] = [];
  const lines = text.split("\n");
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ").trim() });
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push({ type: "list", items: listItems });
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: 2, text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: 3, text: line.slice(4).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

function ProjectGallery({ images }: { images: ProjectImage[] }) {
  const cols =
    images.length >= 3
      ? "sm:grid-cols-3"
      : images.length === 2
        ? "sm:grid-cols-2"
        : "";
  return (
    <div className={`my-2 grid w-full grid-cols-1 gap-2 ${cols}`}>
      {images.map((img) => (
        <figure key={img.src} className="flex flex-col gap-1">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              quality={90}
              sizes={
                images.length >= 3
                  ? "(max-width: 640px) 100vw, 220px"
                  : "(max-width: 640px) 100vw, 660px"
              }
              className="h-auto w-full"
            />
          </div>
          {img.caption && (
            <figcaption className="font-sans text-sm text-gray-500">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const pageUrl = `${siteUrl}/projects/${project.slug}`;

  return buildMetadata({
    title: `${project.title} | Projects | Husan Isomiddinov`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    openGraph: {
      url: pageUrl,
      type: "article",
    },
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    notFound();
  }

  const linkEntries = Object.entries(project.links ?? {}).filter(
    (entry): entry is [string, string] =>
      typeof entry[1] === "string" && isHttpUrl(entry[1]),
  );

  const descriptionBlocks = parseDescriptionBlocks(project.description);
  const hasDescription = descriptionBlocks.length > 0;
  const galleryAfter = new Map<number, ProjectImage[]>();
  let currentHeading = "";
  descriptionBlocks.forEach((block, i) => {
    if (block.type === "heading") currentHeading = block.text;
    const next = descriptionBlocks[i + 1];
    if (!next || next.type === "heading") {
      const images = (project.images ?? []).filter(
        (img) => img.section === currentHeading,
      );
      if (images.length > 0) galleryAfter.set(i, images);
    }
  });
  const hasPapers = (project.papers?.length ?? 0) > 0;
  const techLine = project.tech?.join(" · ");

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="w-full">
        <BackLink href="/projects">← projects</BackLink>
      </div>

      <div className="w-full">
        <p className="mb-1 font-sans text-lg font-bold text-gray-800">
          {project.title}
        </p>

        {(project.date || techLine) && (
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0 font-sans text-sm text-gray-400">
            {project.date && <span>{formatDate(project.date)}</span>}
            {project.date && techLine && <span>·</span>}
            {techLine && <span>{techLine}</span>}
          </div>
        )}

        <p className="text-base leading-[1.6] text-gray-600">
          {project.summary}
        </p>

        {linkEntries.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-2">
            {linkEntries.map(([key, href]) => (
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
        )}
      </div>

      {(hasDescription || project.status === "planned") && (
        <>
          <hr className="w-full border-gray-300" />
          <div className="w-full">
            <p className="mb-2 font-sans text-base font-medium text-brand-500">
              Description
            </p>
            {!hasDescription ? (
              <p className="text-base leading-[1.6] text-gray-500">
                {project.status === "planned"
                  ? "This project hasn't started yet. Check back soon."
                  : "No description yet."}
              </p>
            ) : (
              <div className="flex w-full flex-col items-start gap-2">
                {descriptionBlocks.map((block, idx) => {
                  const node = (() => {
                    if (block.type === "heading") {
                      return (
                        <p
                          key={idx}
                          className={`font-sans font-semibold text-brand-500 ${
                            block.level === 2 ? "text-base" : "text-sm"
                          } ${idx === 0 ? "" : "pt-1"}`}
                        >
                          {block.text}
                        </p>
                      );
                    }

                    if (block.type === "list") {
                      return (
                        <div
                          key={idx}
                          className="flex w-full flex-col items-start gap-1"
                        >
                          {block.items.map((item, itemIdx) => (
                            <div
                              key={`${idx}-${itemIdx}`}
                              className="flex w-full items-start gap-2"
                            >
                              <span className="leading-[1.6] text-gray-500">
                                •
                              </span>
                              <span className="text-base leading-[1.6] text-gray-600">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <p
                        key={idx}
                        className="text-base leading-[1.6] text-gray-600"
                      >
                        {block.text}
                      </p>
                    );
                  })();
                  const gallery = galleryAfter.get(idx);
                  return (
                    <Fragment key={idx}>
                      {node}
                      {gallery && <ProjectGallery images={gallery} />}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {hasPapers && (
        <>
          <hr className="w-full border-gray-300" />
          <div id="papers" className="w-full">
            <p className="mb-2 font-sans text-base font-medium text-brand-500">
              Papers Read
            </p>
            <div className="flex w-full flex-col items-start gap-2">
              {project.papers!.map((paper, idx) => (
                <div key={idx} className="flex w-full items-baseline gap-2">
                  <span className="font-sans font-medium text-brand-500">
                    •
                  </span>
                  <div className="flex flex-1 flex-col items-start">
                    <p className="font-sans text-base font-medium text-gray-600">
                      {paper.title}
                    </p>
                    {paper.notes && (
                      <p className="mt-0.5 text-base leading-[1.6] text-gray-600">
                        {paper.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
