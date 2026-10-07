import Link from "next/link";
import NextImage from "next/image";
import { getAllBooks } from "@/lib/books";
import type { ReadingShelfBook } from "@/types";
import { BackLink, Bookshelf } from "@/components";
import { BookStatus } from "@/components/BookStatus";
import { ArrowRightIcon } from "@/components/icons";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Books | Husan Isomiddinov",
  description: "Books I'm reading and have read, with notes and ratings.",
  path: "/reading",
});

type ListingBook = ReadingShelfBook & {
  summaryExcerpt?: string;
};

function buildSummaryExcerpt(summaryContent?: string): string {
  if (!summaryContent) return "";
  const firstParagraph = summaryContent.split(/\n\s*\n/)[0] ?? "";
  return firstParagraph
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function BookCard({ book, index }: { book: ListingBook; index: number }) {
  return (
    <div className="flex flex-col gap-5 scroll-mt-20">
      {index > 0 && <hr className="mb-3 w-full border-gray-300" />}
      <Link
        href={book.slug}
        className="group relative -mx-4 flex flex-row items-start gap-6 rounded-lg px-4 py-2 transition-colors duration-300 ease-out hover:bg-gray-800/[0.04] hover:no-underline"
      >
        <div className="relative h-[100px] w-[66px] shrink-0 overflow-hidden rounded-lg border border-gray-200 sm:h-[140px] sm:w-[93px] md:h-[160px] md:w-[107px]">
          <NextImage
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="(max-width: 480px) 66px, (max-width: 768px) 93px, 107px"
            loading={index < 6 ? "eager" : "lazy"}
            priority={index < 3}
            style={{ objectFit: "cover" }}
            quality={85}
          />
        </div>
        <div className="flex grow flex-col items-start gap-2">
          <div className="flex w-full items-start justify-between gap-3">
            <h2 className="text-base leading-snug font-bold text-gray-800">
              {book.title}
            </h2>
            <span className="shrink-0 -translate-x-1 text-gray-500 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRightIcon />
            </span>
          </div>
          <p className="font-sans text-base text-gray-500">{book.author}</p>
          <BookStatus book={book} />
          {book.summaryExcerpt && (
            <p className="line-clamp-4 text-sm text-gray-700">
              {book.summaryExcerpt}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

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
        <BackLink href="/reading/collection">
          Browse the full collection →
        </BackLink>
      </div>
      {books.map((book, index) => (
        <BookCard key={book.slug} book={book} index={index} />
      ))}
    </div>
  );
}
