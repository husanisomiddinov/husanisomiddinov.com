import { getAllBooks } from "@/lib/books";
import { isBookRead } from "@/lib/reading-status";
import { Bookshelf, MoreLink } from "@/components";
import { BookCard, buildSummaryExcerpt, type ListingBook } from "@/components/BookCard";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Books",
  description: "Books I'm reading and have read, with notes and ratings.",
  path: "/reading",
});

/** Books in their existing newest-first order, split into "Reading now" and one group per year read. */
function groupBooks(books: ListingBook[]) {
  const groups: { label: string; books: ListingBook[] }[] = [];
  for (const book of books) {
    const label = isBookRead(book)
      ? String(new Date(book.date!).getFullYear())
      : "Reading now";
    let group = groups.find((g) => g.label === label);
    if (!group) {
      group = { label, books: [] };
      groups.push(group);
    }
    group.books.push(book);
  }
  return groups;
}

export default function ReadingPage() {
  const books = getAllBooks().map(
    ({ summaryContent, ...book }): ListingBook => ({
      ...book,
      summaryExcerpt: buildSummaryExcerpt(summaryContent),
    }),
  );
  const groups = groupBooks(books);
  const pagePosition = new Map(books.map((book, i) => [book.slug, i]));

  return (
    <div className="flex w-full flex-col items-stretch gap-8">
      <div className="flex flex-col items-stretch gap-4">
        <Bookshelf books={books} />
        <MoreLink href="/reading/collection" className="self-start">
          Search all {books.length} books
        </MoreLink>
      </div>

      {groups.map((group) => (
        <section key={group.label}>
          <h2 className="mb-1 font-sans text-sm font-semibold text-gray-500">
            {group.label}
          </h2>
          {group.books.map((book, i) => (
            <BookCard
              key={book.slug}
              book={book}
              index={pagePosition.get(book.slug) ?? 0}
              divider={i > 0}
              heading="h3"
            />
          ))}
        </section>
      ))}
    </div>
  );
}
