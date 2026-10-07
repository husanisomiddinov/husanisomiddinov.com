import { notFound } from "next/navigation";
import { Prose, Bookshelf, PageTitle } from "@/components";
import {
  getAllBookSlugs,
  getAllBooks,
  getBook,
  toReadingShelfBooks,
} from "@/lib/books";
import { buildMetadata } from "@/lib/metadata";
import { defaultOpenGraphImages } from "@/config/seo";
import { readingStatusLabel } from "@/lib/reading-status";
import { BookStatus } from "@/components/BookStatus";

export function generateStaticParams() {
  return getAllBookSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return {};

  const { metadata } = book;
  const description = `By: ${metadata.author} - ${readingStatusLabel(metadata)}`;

  return buildMetadata({
    title: metadata.title,
    description,
    path: `/reading/${slug}`,
    openGraph: { images: defaultOpenGraphImages },
  });
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) {
    notFound();
  }

  const books = toReadingShelfBooks(getAllBooks());
  const { metadata } = book;

  return (
    <div className="flex flex-col gap-5">
      <Bookshelf books={books} currentSlug={slug} />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-start">
          <PageTitle>{metadata.title}</PageTitle>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-base text-gray-600">
            <span>By: {metadata.author}</span>
            <BookStatus book={metadata} variant="inline" />
          </div>
        </div>
        <Prose>{book.content}</Prose>
      </div>
    </div>
  );
}
