import { cache, type ReactNode } from "react";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import type { Issue } from "@/types/content";
import { getMdxContent } from "./mdx";
import { readingTimeMinutes, stripMarkdown } from "./posts";
import { MDXImage } from "@/components/MDXImage";

const ISSUES_DIR = path.join(process.cwd(), "content", "newsletter");
const CONFIG_PATH = path.join(process.cwd(), "content", "data", "resources", "newsletter.json");

export interface NewsletterConfig {
  name: string;
  description: string;
  /** Shown in the byline of every issue. */
  author: string;
}

export interface IssuePreview {
  slug: string;
  title: string;
  number: number;
  /** ISO date, e.g. 2026-11-15. */
  date: string;
  summary: string;
  readingTime: number;
}

export const getNewsletterConfig = cache(
  (): NewsletterConfig => JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")),
);

/** YAML turns a bare 2026-11-15 into a Date, so bring it back to the ISO day. */
function toIsoDay(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : "";
}

function issueFiles(): string[] {
  if (!fs.existsSync(ISSUES_DIR)) return [];
  return fs.readdirSync(ISSUES_DIR).filter((f) => f.endsWith(".mdx"));
}

/** Every issue, newest first. */
export const getAllIssues = cache((): IssuePreview[] => {
  const issues = issueFiles().map((file): IssuePreview => {
    const { data, content } = matter(fs.readFileSync(path.join(ISSUES_DIR, file), "utf8"));
    const frontmatter = data as Partial<Issue>;
    return {
      slug: file.replace(/\.mdx$/, ""),
      title: frontmatter.title ?? "",
      number: Number(frontmatter.issue ?? 0),
      date: toIsoDay(data.date),
      summary: frontmatter.summary ?? "",
      readingTime: readingTimeMinutes(stripMarkdown(content)),
    };
  });

  return issues.sort((a, b) => b.number - a.number || b.date.localeCompare(a.date));
});

export const getIssueContent = cache(async (slug: string): Promise<ReactNode | null> => {
  const compiled = await getMdxContent<Issue>(["newsletter", `${slug}.mdx`], {
    img: MDXImage,
  });
  return compiled?.content ?? null;
});

/** "No. 03" */
export function issueLabel(number: number): string {
  return `No. ${String(number).padStart(2, "0")}`;
}

export function formatIssueDate(date: string, style: "long" | "short" = "long"): string {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}
