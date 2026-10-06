import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BackLink } from "@/components";
import { ProjectProgressBar } from "@/components/ProjectProgressBar";
import { DIAGRAMS } from "@/components/diagrams";
import { siteUrl } from "@/config/site";
import { getAllProjectSlugs, getProject } from "@/lib/data";
import { isHttpUrl } from "@/lib/url";
import type { ProjectImage } from "@/types";
import { buildMetadata } from "@/lib/metadata";

type DescriptionBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "diagram"; name: string };

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderInline(text: string): ReactNode[] {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="rounded border border-gray-200 bg-brand-50 px-1 py-0.5 text-[0.85em] text-[#b5384e]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
}

interface ArticleSection {
  id: string;
  number: number;
  title: string;
  weight: number;
}

function buildSections(
  blocks: DescriptionBlock[],
  images: ProjectImage[],
): { intro: number; sections: ArticleSection[] } {
  let intro = 0;
  const sections: ArticleSection[] = [];
  let current: ArticleSection | null = null;

  for (const block of blocks) {
    if (block.type === "heading" && block.level === 2) {
      current = {
        id: slugify(block.text),
        number: sections.length + 1,
        title: block.text,
        weight: 0,
      };
      sections.push(current);
      continue;
    }
    const size =
      block.type === "list"
        ? block.items.join(" ").length
        : block.type === "diagram"
          ? 400
          : block.text.length;
    if (current) current.weight += size;
    else intro += size;
  }

  for (const img of images) {
    const owner = sections.find((sec) => sec.title === img.section);
    if (owner) owner.weight += 300;
  }

  return { intro, sections };
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

    const diagram = /^\[\[diagram:([a-z0-9-]+)\]\]$/.exec(line);
    if (diagram) {
      flushParagraph();
      flushList();
      blocks.push({ type: "diagram", name: diagram[1] });
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
  const hasPapers = (project.papers?.length ?? 0) > 0;
  const techLine = project.tech?.join(" · ");

  const { intro, sections } = buildSections(
    descriptionBlocks,
    project.images ?? [],
  );
  const sectionNumber = new Map(sections.map((sec) => [sec.title, sec.number]));

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

  const progressSections = [
    { id: "project-top", label: "intro", weight: Math.max(intro, 400) },
    ...sections.map((sec) => ({
      id: sec.id,
      label: String(sec.number),
      weight: Math.max(sec.weight, 200),
    })),
  ];

  return (
    <div id="project-top" className="flex w-full flex-col items-center gap-8">
      {sections.length > 0 && (
        <ProjectProgressBar sections={progressSections} endId="project-end" />
      )}

      <header className="flex w-full flex-col items-center gap-4 pt-2 text-center">
        <BackLink href="/projects">← back to projects</BackLink>
        <h1 className="mt-4 font-sans text-3xl leading-tight font-bold text-balance text-gray-800">
          {project.title}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-sans text-sm text-gray-500">
          {project.date && <span>{formatDate(project.date)}</span>}
          {linkEntries.map(([key, href]) => (
            <Fragment key={key}>
              <span aria-hidden>·</span>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="lowercase no-underline hover:text-brand-500 hover:underline"
              >
                {LINK_LABELS[key] ?? key}
              </a>
            </Fragment>
          ))}
        </div>
        {techLine && (
          <p className="font-sans text-sm text-gray-400">{techLine}</p>
        )}
      </header>

      <div className="flex w-full flex-col gap-4 rounded-md bg-brand-50 p-4">
        <p className="text-base leading-[1.6] font-bold text-gray-800">
          {project.summary}
        </p>
        {sections.length > 1 && (
          <ol className="flex flex-col gap-1 font-sans text-sm text-gray-600">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="underline decoration-gray-300 decoration-dotted underline-offset-4 hover:text-brand-500 hover:decoration-brand-500"
                >
                  {sec.number}. {sec.title}
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>

      {(hasDescription || project.status === "planned") && (
        <article className="flex w-full flex-col items-start gap-3 text-gray-800">
          {!hasDescription ? (
            <p className="text-base leading-[1.7] text-gray-500">
              {project.status === "planned"
                ? "This project hasn't started yet. Check back soon."
                : "No description yet."}
            </p>
          ) : (
            descriptionBlocks.map((block, idx) => {
              const node = (() => {
                if (block.type === "heading") {
                  const id = slugify(block.text);
                  const isH2 = block.level === 2;
                  const number = isH2
                    ? sectionNumber.get(block.text)
                    : undefined;
                  const Tag = isH2 ? "h2" : "h3";
                  return (
                    <Tag
                      id={id}
                      className={`group relative scroll-mt-28 font-sans font-bold text-gray-800 ${
                        isH2 ? "pt-8 text-2xl" : "pt-3 text-lg"
                      }`}
                    >
                      <a
                        href={`#${id}`}
                        aria-label={`Link to ${block.text}`}
                        className="absolute top-auto -left-6 hidden font-normal text-gray-300 no-underline group-hover:inline lg:block lg:opacity-0 lg:group-hover:opacity-100"
                      >
                        #
                      </a>
                      {number ? `${number}. ` : ""}
                      {block.text}
                    </Tag>
                  );
                }

                if (block.type === "list") {
                  return (
                    <ul className="flex w-full flex-col items-start gap-1.5">
                      {block.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex w-full items-start gap-2 text-base leading-[1.7]"
                        >
                          <span aria-hidden className="text-gray-400">
                            •
                          </span>
                          <span>{renderInline(item)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "diagram") {
                  const Diagram = DIAGRAMS[block.name];
                  return Diagram ? <Diagram /> : null;
                }

                return (
                  <p className="text-base leading-[1.7]">
                    {renderInline(block.text)}
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
            })
          )}
        </article>
      )}

      {hasPapers && (
        <section id="papers" className="flex w-full flex-col gap-3">
          <h2 className="font-sans text-2xl font-bold text-gray-800">
            Papers Read
          </h2>
          <div className="flex w-full flex-col items-start gap-3">
            {project.papers!.map((paper, idx) => (
              <div key={idx} className="flex w-full items-baseline gap-2">
                <span className="text-gray-400">•</span>
                <div className="flex flex-1 flex-col items-start">
                  <p className="font-sans text-base font-bold text-gray-800">
                    {paper.title}
                  </p>
                  {paper.notes && (
                    <p className="mt-0.5 text-base leading-[1.7] text-gray-800">
                      {paper.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div id="project-end" />
    </div>
  );
}
