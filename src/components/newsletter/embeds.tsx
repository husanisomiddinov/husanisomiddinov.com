import type { ReactNode } from "react";
import { BookCard, buildSummaryExcerpt } from "@/components/BookCard";
import { EssayRow } from "@/components/EssayRow";
import { ProjectRow } from "@/components/ProjectsBrowser";
import { getAllBooks } from "@/lib/books";
import { getProject } from "@/lib/data";
import { getAllWritingMetadata } from "@/lib/posts";

/** Keeps the article's text styles off an embedded row, so it looks the way it does on its own page. */
function Embed({ children }: { children: ReactNode }) {
  return <div className="not-prose my-2">{children}</div>;
}

/** A wrong slug should stop the build, not ship an issue with a hole in it. */
function missing(kind: string, slug: string): never {
  throw new Error(`[newsletter] No ${kind} with the slug "${slug}"`);
}

/** An essay from /writing, as the row used on the writing page. Use in an issue as `<Essay slug="..." />`. */
export function Essay({ slug }: { slug: string }) {
  const post = getAllWritingMetadata().find((p) => p.slug === slug) ?? missing("essay", slug);
  return (
    <Embed>
      <EssayRow post={post} />
    </Embed>
  );
}

/** A book from /reading, with its cover and reading status. Use in an issue as `<Book slug="..." />`. */
export function Book({ slug }: { slug: string }) {
  const book = getAllBooks().find((b) => b.slug === `/reading/${slug}`) ?? missing("book", slug);
  return (
    <Embed>
      <BookCard book={{ ...book, summaryExcerpt: buildSummaryExcerpt(book.summaryContent) }} index={0} />
    </Embed>
  );
}

/** A project from /projects, with its live diagram previews. Use in an issue as `<Project slug="..." />`. */
export function Project({ slug }: { slug: string }) {
  const project = getProject(slug) ?? missing("project", slug);
  return (
    <Embed>
      <ul className="flex w-full flex-col">
        <ProjectRow project={project} index={0} isLast />
      </ul>
    </Embed>
  );
}
