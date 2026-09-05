import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { getAllBooks } from "@/lib/books";
import { getAllWritingSlugs } from "@/lib/posts";
import { getAllProjectSlugs } from "@/lib/data";

const STATIC_PAGES = [
  "",
  "/writing",
  "/reading",
  "/reading/collection",
  "/about",
  "/heuristics",
  "/studio",
  "/studio/tashkent",
  "/projects",
  "/arsenal",
  "/facts",
  "/quotes",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const bookPaths = getAllBooks().map((book) => book.slug);
  const writingPaths = getAllWritingSlugs().map((slug) => `/writing/${slug}`);
  const projectPaths = getAllProjectSlugs().map((slug) => `/projects/${slug}`);

  const allPaths = Array.from(
    new Set([...STATIC_PAGES, ...bookPaths, ...writingPaths, ...projectPaths])
  ).sort((a, b) => a.localeCompare(b));

  return allPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
