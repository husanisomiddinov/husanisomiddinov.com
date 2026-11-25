import Link from "next/link";
import type { ReadingShelfBook } from "@/types";
import { BookCover } from "@/components/BookCover";
import { BookStatus } from "@/components/BookStatus";

export type ListingBook = ReadingShelfBook & {
  summaryExcerpt?: string;
};

export function buildSummaryExcerpt(summaryContent?: string): string {
  if (!summaryContent) return "";
  const firstParagraph = summaryContent.split(/\n\s*\n/)[0] ?? "";
  return firstParagraph
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** One book in a list: small cover, title, author, status and the first lines of my notes. */
export function BookCard({
  book,
  index,
}: {
  book: ListingBook;
  /** Position in the list: loads the first covers eagerly and puts a hairline above every row but the first. */
  index: number;
}) {
  return (
    <div className="scroll-mt-20">
      {index > 0 && <hr className="border-gray-300" />}
      <Link
        href={book.slug}
        className="group relative flex flex-row items-start gap-6 py-4 hover:no-underline"
      >
        <BookCover
          src={book.coverImage}
          alt=""
          sizes="(max-width: 640px) 66px, (max-width: 768px) 93px, 107px"
          eager={index < 6}
          priority={index < 3}
          className="w-[72px] sm:w-[99px] md:w-[113px]"
        />
        <div className="flex min-w-0 grow flex-col items-start gap-1">
          <h2 className="text-base leading-snug font-bold text-gray-800 transition-colors duration-200 group-hover:text-brand-500">
            {book.title}
          </h2>
          <p className="font-sans text-sm text-gray-500">{book.author}</p>
          <BookStatus book={book} />
          {book.summaryExcerpt && (
            <p className="mt-1 line-clamp-2 text-prose-sm text-gray-600">
              {book.summaryExcerpt}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
