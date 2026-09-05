import path from "path";
import fs from "fs";
import type { Book, ReadingShelfBook } from "@/types/content";
import { getMdxContent, type MdxContent } from "./mdx";
import { MDXImage } from "@/components/MDXImage";

export function getAllBooks(): Book[] {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "books", "index.json"), "utf8")
  );
}

export function getAllBookSlugs(): string[] {
  return getAllBooks().map((item) => item.slug.replace(/^\/reading\//, ""));
}

export async function getBook(slug: string): Promise<MdxContent<Book> | undefined> {
  return getMdxContent<Book>(["books", `${slug}.mdx`], { img: MDXImage });
}

/** Strips `summaryContent` — the Bookshelf only needs the shelf-display fields. */
export function toReadingShelfBooks(books: Book[]): ReadingShelfBook[] {
  return books.map(({ title, author, date, rating, coverImage, spineColor, textColor, slug }) => ({
    title,
    author,
    date,
    rating,
    coverImage,
    spineColor,
    textColor,
    slug,
  }));
}
