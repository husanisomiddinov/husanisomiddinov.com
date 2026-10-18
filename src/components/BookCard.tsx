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

export function BookCard({ book, index }: { book: ListingBook; index: number }) {
  return (
    <div className="flex flex-col gap-5 scroll-mt-20">
      {index > 0 && <hr className="mb-3 w-full border-gray-300" />}
      <Link
        href={book.slug}
        className="group relative flex flex-row items-start gap-6 py-2 hover:no-underline"
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
            <h2 className="text-base leading-snug font-bold text-gray-800 transition-colors duration-200 group-hover:text-brand-500">
              {book.title}
            </h2>
          </div>
          <p className="font-sans text-base text-gray-500">{book.author}</p>
          <BookStatus book={book} />
          {book.summaryExcerpt && (
            <p className="line-clamp-4 text-prose-sm text-gray-700">
              {book.summaryExcerpt}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
