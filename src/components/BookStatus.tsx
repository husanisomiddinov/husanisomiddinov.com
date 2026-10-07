import { isBookRead } from "@/lib/reading-status";
import type { ReadingShelfBook } from "@/types";

const DOT = <span className="text-gray-400">·</span>;

/**
 * "line" (default): the "Read: date · Rating: n/10" paragraph under a book's title.
 * "inline": the same facts as bare spans, for placing inside a parent flex row.
 */
export function BookStatus({
  book,
  variant = "line",
}: {
  book: Pick<ReadingShelfBook, "date" | "rating" | "started">;
  variant?: "line" | "inline";
}) {
  const read = isBookRead(book);

  if (variant === "inline") {
    return read ? (
      <>
        {DOT}
        <span>Read: {book.date}</span>
        {book.rating != null && (
          <>
            {DOT}
            <span className="font-bold text-gray-800">Rating: {book.rating}/10</span>
          </>
        )}
      </>
    ) : (
      <>
        {DOT}
        <span className="font-bold text-brand-500">Currently Reading</span>
        {book.started && (
          <>
            {DOT}
            <span>Started: {book.started}</span>
          </>
        )}
      </>
    );
  }

  if (!read) {
    return (
      <p className="font-sans text-sm text-gray-600">
        <span className="font-bold text-brand-500">Currently Reading</span>
        {book.started && (
          <>
            {" "}
            {DOT} Started: {book.started}
          </>
        )}
      </p>
    );
  }

  return (
    <p className="font-sans text-sm text-gray-600">
      Read: {book.date}
      {book.rating != null && (
        <>
          {" "}
          {DOT}{" "}
          <span className="font-bold text-gray-800">
            Rating: {book.rating}/10
          </span>
        </>
      )}
    </p>
  );
}
