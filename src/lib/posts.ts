import path from "path";
import fs from "fs";
import matter from "gray-matter";
import type { Post } from "@/types/content";
import { getMdxContent } from "./mdx";
import { MDXImage } from "@/components/MDXImage";

const WRITING_DIR = path.join(process.cwd(), "content", "writing");

function toTimestamp(date: string, slug: string): number {
  const time = new Date(date).getTime();
  if (Number.isNaN(time)) {
    console.warn(`[posts] Invalid or missing date for "${slug}": ${date || "(empty)"}`);
    return 0;
  }
  return time;
}

const WORDS_PER_MINUTE = 200;

/** Reduce MDX/markdown to plain prose for excerpts and word counts. */
function stripMarkdown(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/<[^>]+>/g, " ") // html/jsx tags
    .replace(/^#{1,6}\s+/gm, " ") // headings
    .replace(/[*_`~>|]/g, "") // inline markers
    .replace(/\s+/g, " ")
    .trim();
}

function buildExcerpt(text: string, max = 160): string {
  if (!text) return "";
  const firstSentenceEnd = text.indexOf(". ");
  let snippet =
    firstSentenceEnd > 40 && firstSentenceEnd < max
      ? text.slice(0, firstSentenceEnd + 1)
      : text;
  if (snippet.length > max) {
    snippet = snippet.slice(0, max).replace(/\s+\S*$/, "") + "…";
  }
  return snippet;
}

function readingTimeMinutes(text: string): number {
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export interface WritingPreview {
  title: string;
  date: string;
  tag: "essay" | "note";
  slug: string;
  cover: string | null;
  excerpt: string;
  readingTime: number;
}

export function getAllWritingMetadata(): WritingPreview[] {
  const files = fs.readdirSync(WRITING_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file): WritingPreview => {
    const filePath = path.join(WRITING_DIR, file);
    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
    const plain = stripMarkdown(content);
    return {
      title: data.title ?? "",
      date: data.date ?? "",
      tag: (data.tag as "essay" | "note") || "essay",
      slug: file.replace(/\.mdx$/, ""),
      cover: data.cover ?? null,
      excerpt: buildExcerpt(plain),
      readingTime: readingTimeMinutes(plain),
    };
  });

  return posts.sort(
    (a, b) => toTimestamp(b.date, b.slug) - toTimestamp(a.date, a.slug)
  );
}

export function getAllWritingSlugs(): string[] {
  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getWritingBySlug(slug: string) {
  const content = await getMdxContent<Post>(["writing", `${slug}.mdx`], { img: MDXImage });
  if (!content) return null;
  return {
    ...content.metadata,
    slug,
    content: content.content,
  };
}
