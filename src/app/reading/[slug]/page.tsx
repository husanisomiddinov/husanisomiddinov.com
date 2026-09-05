import { notFound } from "next/navigation";
import { Prose, BookshelfLazy } from "@/components";
import { getAllBookSlugs, getAllBooks, getBook, toReadingShelfBooks } from "@/lib/books";
import { buildMetadata } from "@/lib/metadata";
import { defaultOpenGraphImages } from "@/config/seo";

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
  const hasCompleted = metadata.date && metadata.rating;
  const description = hasCompleted
    ? `By: ${metadata.author} - Read: ${metadata.date} - Rating: ${metadata.rating}/10`
    : `By: ${metadata.author} - Currently Reading`;

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
  const hasCompleted = metadata.date && metadata.rating;

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-8">
        <BookshelfLazy books={books} currentSlug={slug} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-start">
          <h1 className="text-lg leading-snug font-bold text-gray-800 md:text-xl">
            {metadata.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-base text-gray-600">
            <span>By: {metadata.author}</span>
            {hasCompleted ? (
              <>
                <span className="text-gray-400">·</span>
                <span>Read: {metadata.date}</span>
                <span className="text-gray-400">·</span>
                <span className="font-bold text-gray-800">Rating: {metadata.rating}/10</span>
              </>
            ) : (
              <>
                <span className="text-gray-400">·</span>
                <span className="font-bold text-brand-500">Currently Reading</span>
              </>
            )}
          </div>
        </div>
        <Prose>{book.content}</Prose>
      </div>
    </div>
  );
}
