import { isBookRead } from "@/lib/reading-status";
import type { ReadingShelfBook } from "@/types";

/** The "Read: date · Rating: n/10" line (or "Currently Reading") used under a book's title. */
export function BookStatus({
  book,
}: {
  book: Pick<ReadingShelfBook, "date" | "rating">;
}) {
  if (!isBookRead(book)) {
    return (
      <p className="font-sans text-sm font-bold text-brand-500">
        Currently Reading
      </p>
    );
  }

  return (
    <p className="font-sans text-sm text-gray-600">
      Read: {book.date}
      {book.rating != null && (
        <>
          {" "}
          <span className="text-gray-400">·</span>{" "}
          <span className="font-bold text-gray-800">
            Rating: {book.rating}/10
          </span>
        </>
      )}
    </p>
  );
}
