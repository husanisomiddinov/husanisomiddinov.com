import { getAllBooks } from "@/lib/books";
import { Bookshelf, Button } from "@/components";
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
    <div className="flex flex-col gap-5">
      <Bookshelf books={books} />
      <div className="flex justify-center">
        <Button href="/reading/collection">
          Browse the full collection &rarr;
        </Button>
      </div>
      {books.map((book, index) => (
        <BookCard key={book.slug} book={book} index={index} />
      ))}
    </div>
  );
}
