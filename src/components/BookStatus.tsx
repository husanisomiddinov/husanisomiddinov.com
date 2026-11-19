import { isBookRead } from "@/lib/reading-status";
import type { ReadingShelfBook } from "@/types";

const DOT = <span className="text-gray-400">·</span>;

/** "January 22, 2026" -> "Jan 2026". Anything unparseable is shown as written. */
function shortMonthYear(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * "line" (default): a short "Read Jan 2026 · 9/10" line under a book's title in lists.
 * "inline": the same facts with the full date, as bare spans inside a parent flex row
 * on the book page.
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
        <span>Read {book.date}</span>
        {book.rating != null && (
          <>
            {DOT}
            <span className="text-gray-800">{book.rating}/10</span>
          </>
        )}
      </>
    ) : (
      <>
        {DOT}
        <span className="text-brand-500">Reading now</span>
        {book.started && (
          <>
            {DOT}
            <span>since {book.started}</span>
          </>
        )}
      </>
    );
  }

  if (!read) {
    return (
      <p className="font-sans text-sm text-gray-600">
        <span className="text-brand-500">Reading now</span>
        {book.started && <>, since {shortMonthYear(book.started)}</>}
      </p>
    );
  }

  return (
    <p className="font-sans text-sm text-gray-600">
      Read {shortMonthYear(book.date!)}
      {book.rating != null && (
        <>
          {" "}
          {DOT} <span className="text-gray-800">{book.rating}/10</span>
        </>
      )}
    </p>
  );
}
