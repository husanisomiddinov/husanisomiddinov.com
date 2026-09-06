import type { ReadingShelfBook } from "@/types/content";

/** A completion date determines reading status; a rating is optional. */
export function isBookRead(book: Pick<ReadingShelfBook, "date">): boolean {
  return Boolean(book.date);
}

export function readingStatusLabel(
  book: Pick<ReadingShelfBook, "date" | "rating">,
): string {
  if (!isBookRead(book)) return "Currently reading";
  const readDate = `Read ${book.date}`;
  return book.rating == null ? readDate : `${book.rating}/10 · ${readDate}`;
}
