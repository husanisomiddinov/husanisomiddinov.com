import Link from "next/link";
import { BookCard, buildSummaryExcerpt } from "@/components/BookCard";
import type { Book } from "@/types/content";

export function FeaturedBooks({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 border-t border-gray-300 pt-4">
      <div className="flex flex-col gap-5">
        {books.map(({ summaryContent, ...book }, index) => (
          <BookCard
            key={book.slug}
            book={{ ...book, summaryExcerpt: buildSummaryExcerpt(summaryContent) }}
            index={index}
          />
        ))}
      </div>
      <Link
        href="/reading"
        className="font-sans text-sm font-medium text-gray-500 no-underline transition-colors duration-200 hover:text-brand-500"
      >
        All books
      </Link>
    </section>
  );
}
