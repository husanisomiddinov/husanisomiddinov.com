import { getAllBooks } from "@/lib/books";
import { Bookshelf } from "@/components";
import { BookCard, buildSummaryExcerpt, type ListingBook } from "@/components/BookCard";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Books",
  description: "Books I'm reading and have read, with notes and ratings.",
  path: "/reading",
});

export default function ReadingPage() {
  const books = getAllBooks().map(
    ({ summaryContent, ...book }): ListingBook => ({
      ...book,
      summaryExcerpt: buildSummaryExcerpt(summaryContent),
    }),
  );

  return (
    <div className="flex w-full flex-col items-stretch gap-8">
      <Bookshelf books={books} />

      <div>
        {books.map((book, index) => (
          <BookCard key={book.slug} book={book} index={index} />
        ))}
      </div>
    </div>
  );
}
