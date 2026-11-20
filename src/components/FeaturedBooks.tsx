import { MoreLink } from "@/components/MoreLink";
import { BookCard, buildSummaryExcerpt } from "@/components/BookCard";
import type { Book } from "@/types/content";

export function FeaturedBooks({
  books,
  total,
}: {
  books: Book[];
  /** Size of the full list, shown in the link to it. */
  total: number;
}) {
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 border-t border-gray-300 pt-4">
      <div className="flex flex-col">
        {books.map(({ summaryContent, ...book }, index) => (
          <BookCard
            key={book.slug}
            book={{ ...book, summaryExcerpt: buildSummaryExcerpt(summaryContent) }}
            index={index}
          />
        ))}
      </div>
      <MoreLink href="/reading" className="mt-5">
        All {total} books
      </MoreLink>
    </section>
  );
}
