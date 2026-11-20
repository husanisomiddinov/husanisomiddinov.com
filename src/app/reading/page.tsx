import { getAllBooks } from "@/lib/books";
import { Bookshelf, MoreLink } from "@/components";
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
      <div className="flex flex-col items-stretch gap-4">
        <Bookshelf books={books} />
        <MoreLink href="/reading/collection" className="self-start">
          Search all {books.length} books
        </MoreLink>
      </div>

      <div>
        {books.map((book, index) => (
          <BookCard key={book.slug} book={book} index={index} />
        ))}
      </div>
    </div>
  );
}
