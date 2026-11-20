import Link from "next/link";
import NextImage from "next/image";
import type { ReadingShelfBook } from "@/types";
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
  divider = index > 0,
  heading: Heading = "h2",
}: {
  book: ListingBook;
  /** Position in the whole page, used to load the first covers eagerly. */
  index: number;
  /** Hairline above the row. Defaults to every row but the first. */
  divider?: boolean;
  heading?: "h2" | "h3";
}) {
  return (
    <div className="scroll-mt-20">
      {divider && <hr className="border-gray-300" />}
      <Link
        href={book.slug}
        className="group relative flex flex-row items-start gap-6 py-4 hover:no-underline"
      >
        <div className="relative h-[100px] w-[66px] shrink-0 overflow-hidden rounded-lg border border-gray-200 sm:h-[140px] sm:w-[93px] md:h-[160px] md:w-[107px]">
          <NextImage
            src={book.coverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 66px, (max-width: 768px) 93px, 107px"
            loading={index < 6 ? "eager" : "lazy"}
            priority={index < 3}
            style={{ objectFit: "cover" }}
            quality={85}
          />
        </div>
        <div className="flex min-w-0 grow flex-col items-start gap-1">
          <Heading className="text-base leading-snug font-bold text-gray-800 transition-colors duration-200 group-hover:text-brand-500">
            {book.title}
          </Heading>
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
