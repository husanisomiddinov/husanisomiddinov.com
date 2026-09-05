import Link from "next/link";
import { notFound } from "next/navigation";
import { PaintingBanner } from "@/components";
import { siteUrl } from "@/config/site";
import { getAllProjectSlugs, getProject } from "@/lib/data";
import { isHttpUrl } from "@/lib/url";
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
  const ogImageUrl = project.painting?.src ? `${siteUrl}${project.painting.src}` : undefined;

  return buildMetadata({
    title: `${project.title} | Projects | Husan Isomiddinov`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    openGraph: {
      url: pageUrl,
      type: "article",
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            alt: project.title,
            ...(project.painting?.width != null && { width: project.painting.width }),
            ...(project.painting?.height != null && { height: project.painting.height }),
          },
        ],
      }),
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
      typeof entry[1] === "string" && isHttpUrl(entry[1])
  );

  const descriptionBlocks = parseDescriptionBlocks(project.description);
  const hasDescription = descriptionBlocks.length > 0;
  const hasPapers = (project.papers?.length ?? 0) > 0;
  const techLine = project.tech?.join(" · ");

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="w-full">
        <Link
          href="/projects"
          className="font-sans text-sm text-gray-500 no-underline hover:text-brand-500"
        >
          ← projects
        </Link>
      </div>

      {project.painting && <PaintingBanner painting={project.painting} />}

      <div className="w-full">
        <p className="mb-1 font-sans text-lg font-bold text-gray-800">{project.title}</p>

        {(project.date || techLine) && (
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0 font-sans text-sm text-gray-400">
            {project.date && <span>{formatDate(project.date)}</span>}
            {project.date && techLine && <span>·</span>}
            {techLine && <span>{techLine}</span>}
          </div>
        )}

        <p className="text-base leading-[1.6] text-gray-600">{project.summary}</p>

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
            <p className="mb-2 font-sans text-base font-medium text-brand-500">Description</p>
            {!hasDescription ? (
              <p className="text-base leading-[1.6] text-gray-500">
                {project.status === "planned"
                  ? "This project hasn't started yet. Check back soon."
                  : "No description yet."}
              </p>
            ) : (
              <div className="flex w-full flex-col items-start gap-2">
                {descriptionBlocks.map((block, idx) => {
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
                      <div key={idx} className="flex w-full flex-col items-start gap-1">
                        {block.items.map((item, itemIdx) => (
                          <div key={`${idx}-${itemIdx}`} className="flex w-full items-start gap-2">
                            <span className="leading-[1.6] text-gray-500">•</span>
                            <span className="text-base leading-[1.6] text-gray-600">{item}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="text-base leading-[1.6] text-gray-600">
                      {block.text}
                    </p>
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
            <p className="mb-2 font-sans text-base font-medium text-brand-500">Papers Read</p>
            <div className="flex w-full flex-col items-start gap-2">
              {project.papers!.map((paper, idx) => (
                <div key={idx} className="flex w-full items-baseline gap-2">
                  <span className="font-sans font-medium text-brand-500">•</span>
                  <div className="flex flex-1 flex-col items-start">
                    <p className="font-sans text-base font-medium text-gray-600">{paper.title}</p>
                    {paper.notes && (
                      <p className="mt-0.5 text-base leading-[1.6] text-gray-600">{paper.notes}</p>
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
